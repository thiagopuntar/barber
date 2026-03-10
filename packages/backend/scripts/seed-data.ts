#!/usr/bin/env ts-node

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Logger } from "../utils/Logger";

interface ServiceData {
  pk: string;
  sk: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeData {
  pk: string;
  sk: string;
  name: string;
  availability: Array<{
    weekDay: number;
    range: Array<{
      start: string;
      end: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface BusinessData {
  pk: string;
  sk: string;
  name: string;
  description: string;
  image: string;
  url: string;
  address: string;
  city: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data generators using faker

async function generateBusiness(businessId: string): Promise<BusinessData> {
  const { faker } = await import("@faker-js/faker");

  const now = new Date().toISOString();

  return {
    pk: "business",
    sk: businessId,
    name: faker.company.name() + " Barbershop",
    description: faker.company.catchPhrase(),
    image: faker.image.url(),
    url: faker.internet.url(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zip: faker.location.zipCode(),
    country: "USA",
    phone: faker.phone.number(),
    email: faker.internet.email(),
    createdAt: now,
    updatedAt: now,
  };
}

async function generateService(businessId: string, index: number): Promise<ServiceData> {
  const { v4: uuidv4 } = await import("uuid");
  const { faker } = await import("@faker-js/faker");

  const now = new Date().toISOString();
  const serviceId = uuidv4();

  // Generate random appointment/beauty service names using faker
  const serviceTypes = [
    "Haircut",
    "Beard Trim",
    "Hair Coloring",
    "Hair Wash",
    "Facial",
    "Head Massage",
    "Eyebrow Shaping",
    "Hair Treatment",
    "Styling",
    "Shaving",
    "Manicure",
    "Pedicure",
    "Hair Extension",
    "Perm",
    "Deep Conditioning",
    "Consultation",
    "General Appointment",
  ];
  const serviceName = faker.helpers.arrayElement(serviceTypes);

  return {
    pk: `${businessId}#service`,
    sk: serviceId,
    name: serviceName,
    description: faker.lorem.sentence({ min: 3, max: 8 }), // Random description
    price: faker.number.int({ min: 20, max: 150 }), // Random price between 20-150
    duration: faker.number.int({ min: 30, max: 120 }), // Random duration between 30-120 minutes
    createdAt: now,
    updatedAt: now,
  };
}

async function generateEmployee(
  businessId: string,
  index: number
): Promise<EmployeeData> {
  const { v4: uuidv4 } = await import("uuid");
  const { faker } = await import("@faker-js/faker");

  const now = new Date().toISOString();
  const employeeId = uuidv4();

  return {
    pk: `${businessId}#employee`,
    sk: employeeId,
    name: faker.person.fullName(), // Random full name using faker
    availability: [
      {
        weekDay: 0,
        range: [{ start: "09:00", end: "17:00" }],
      },
      {
        weekDay: 1,
        range: [{ start: "09:00", end: "17:00" }],
      },
      {
        weekDay: 2,
        range: [{ start: "09:00", end: "17:00" }],
      },
      {
        weekDay: 3,
        range: [{ start: "09:00", end: "17:00" }],
      },
      {
        weekDay: 4,
        range: [{ start: "09:00", end: "17:00" }],
      },
      {
        weekDay: 5,
        range: [{ start: "09:00", end: "17:00" }],
      },
      {
        weekDay: 6,
        range: [{ start: "09:00", end: "17:00" }],
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

async function seedData(businessId: string, numServices: number, numEmployees: number) {
  if (!businessId) {
    throw new Error("Business ID is required");
  }

  if (numServices < 0 || numEmployees < 0) {
    throw new Error("Number of services and employees must be non-negative");
  }

  const tableName = process.env.APPOINTMENT_TABLE_NAME || "AppointmentTable";

  Logger.info(`Seeding data for business: ${businessId}`);
  Logger.info(`Table: ${tableName}`);
  Logger.info(`Services to create: ${numServices}`);
  Logger.info(`Employees to create: ${numEmployees}`);

  const client = new DynamoDBClient({
    region: "us-east-1",
  });
  const dynamoClient = DynamoDBDocumentClient.from(client);

  try {
    // Seed business
    Logger.info("\nSeeding business...");
    const business = await generateBusiness(businessId);
    const businessCommand = new PutCommand({
      TableName: tableName,
      Item: business,
    });
    await dynamoClient.send(businessCommand);
    Logger.info(`✓ Created business: ${business.name} (ID: ${business.sk})`);

    // Seed services
    Logger.info("\nSeeding services...");
    for (let i = 0; i < numServices; i++) {
      const service = await generateService(businessId, i);
      const command = new PutCommand({
        TableName: tableName,
        Item: service,
      });

      await dynamoClient.send(command);
      Logger.info(`✓ Created service: ${service.name} (ID: ${service.sk})`);
    }

    // Seed employees
    Logger.info("\nSeeding employees...");
    for (let i = 0; i < numEmployees; i++) {
      const employee = await generateEmployee(businessId, i);
      const command = new PutCommand({
        TableName: tableName,
        Item: employee,
      });

      await dynamoClient.send(command);
      Logger.info(`✓ Created employee: ${employee.name} (ID: ${employee.sk})`);
    }

    Logger.info("\n✅ Seeding completed successfully!");
    Logger.info(
      `Created ${numServices} services and ${numEmployees} employees for business ${businessId}`
    );
  } catch (error) {
    Logger.error("❌ Error seeding data:", error);
    throw error;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    Logger.error("Usage: ts-node seed-data.ts <businessId> <numServices> <numEmployees>");
    Logger.error("Example: ts-node seed-data.ts business123 5 3");
    process.exit(1);
  }

  const businessId = args[0];
  const numServices = parseInt(args[1], 10);
  const numEmployees = parseInt(args[2], 10);

  if (isNaN(numServices) || isNaN(numEmployees)) {
    Logger.error("numServices and numEmployees must be valid numbers");
    process.exit(1);
  }

  return { businessId, numServices, numEmployees };
}

// Main execution
async function main() {
  try {
    const { businessId, numServices, numEmployees } = parseArgs();
    await seedData(businessId, numServices, numEmployees);
  } catch (error) {
    Logger.error("Failed to seed data:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { seedData, generateService, generateEmployee, generateBusiness };
