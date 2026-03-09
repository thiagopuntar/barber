import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as dotenv from "dotenv";

dotenv.config();

type JwtPayload = {
  token_use?: string;
  exp?: number;
};

function calculateSecretHash(
  clientId: string,
  clientSecret: string,
  username: string
): string {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

async function generateToken() {
  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;
  const username = process.env.COGNITO_USERNAME;
  const password = process.env.COGNITO_PASSWORD;
  const region = process.env.AWS_REGION || "us-east-1";

  if (!clientId || !username || !password) {
    console.error("Missing required environment variables in .env:");
    if (!clientId) console.error(" - COGNITO_CLIENT_ID");
    if (!username) console.error(" - COGNITO_USERNAME");
    if (!password) console.error(" - COGNITO_PASSWORD");
    process.exit(1);
  }

  const client = new CognitoIdentityProviderClient({ region });

  const authParams: Record<string, string> = {
    USERNAME: username,
    PASSWORD: password,
  };

  if (clientSecret) {
    authParams.SECRET_HASH = calculateSecretHash(clientId, clientSecret, username);
  }

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: clientId,
      AuthParameters: authParams,
    });

    const response = await client.send(command);
    if (response.ChallengeName) {
      throw new Error(
        `Cognito returned challenge '${response.ChallengeName}'. Complete the challenge before requesting a token.`
      );
    }

    const token = response.AuthenticationResult?.IdToken;
    if (!token) {
      throw new Error("No IdToken returned from Cognito");
    }

    const payload = decodeJwtPayload(token);
    if (payload.token_use !== "id") {
      throw new Error(
        `Expected an IdToken but received token_use='${payload.token_use ?? "unknown"}'`
      );
    }

    const secondsLeft = payload.exp
      ? payload.exp - Math.floor(Date.now() / 1000)
      : undefined;
    if (secondsLeft !== undefined && secondsLeft <= 0) {
      throw new Error("Generated token is already expired");
    }

    console.log(
      `Token type: ${payload.token_use}; expires in ${secondsLeft ?? "unknown"} seconds.`
    );
    console.log("Token successfully generated.");
    await updateSettings(token);
  } catch (error: any) {
    console.error("Authentication failed:", error.message);
    process.exit(1);
  }
}

async function updateSettings(token: string) {
  const settingsPath = path.resolve(__dirname, "../../../.vscode/settings.json");
  const backendEnvPath = path.resolve(__dirname, "../.env");

  try {
    // Update .vscode/settings.json
    if (fs.existsSync(settingsPath)) {
      const settingsContent = fs.readFileSync(settingsPath, "utf8");
      const settings = JSON.parse(settingsContent);

      if (
        settings["rest-client.environmentVariables"] &&
        settings["rest-client.environmentVariables"]["prod"]
      ) {
        settings["rest-client.environmentVariables"]["prod"]["authToken"] = token;
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");
        console.log("Updated .vscode/settings.json with the new token.");
      } else {
        console.warn(
          "Could not find 'rest-client.environmentVariables.prod' in settings.json. Skipping update."
        );
      }
    } else {
      console.warn(".vscode/settings.json not found. Skipping update.");
    }

    // Update backend .env file
    if (fs.existsSync(backendEnvPath)) {
      let envContent = fs.readFileSync(backendEnvPath, "utf8");
      if (envContent.includes("AUTH_TOKEN=")) {
        envContent = envContent.replace(/AUTH_TOKEN=.*/, `AUTH_TOKEN=${token}`);
      } else {
        envContent += `\nAUTH_TOKEN=${token}`;
      }
      fs.writeFileSync(backendEnvPath, envContent, "utf8");
      console.log("Updated packages/backend/.env with the new token.");
    }
  } catch (error: any) {
    console.error("Failed to update settings:", error.message);
  }
}

function decodeJwtPayload(token: string): JwtPayload {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Token is not a valid JWT");
  }

  const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
}

generateToken();
