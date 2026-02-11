import { createAuthClient } from "better-auth/react"; // Importa o cliente de autenticação do Better Auth


/**
 * Cliente de autenticação do Better Auth.
 * Inicializa a conexão com o backend (baseURL configurada para localhost ou variável de ambiente).
 * A URL base deve apontar para onde o backend está rodando.
 */
export const authClient = createAuthClient({
    baseURL: "http://localhost:3000", // URL base da API do backend (deve ser ajustada para produção)
});

