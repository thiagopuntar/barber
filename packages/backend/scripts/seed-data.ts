#!/usr/bin/env ts-node

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

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
  createdAt: string;
  updatedAt: string;
}

// Mock data generators using faker

function generateService(businessId: string, index: number): ServiceData {
  const now = new Date().toISOString();
  const serviceId = uuidv4();

  // Generate random barber/beauty service names using faker
  const serviceTypes = ['Haircut', 'Beard Trim', 'Hair Coloring', 'Hair Wash', 'Facial', 'Head Massage', 'Eyebrow Shaping', 'Hair Treatment', 'Styling', 'Shaving', 'Manicure', 'Pedicure', 'Hair Extension', 'Perm', 'Deep Conditioning'];
  const serviceName = faker.helpers.arrayElement(serviceTypes);

  return {
    pk: `business#${businessId}#type#service`,
    sk: serviceId,
    name: serviceName,
    description: faker.lorem.sentence({ min: 3, max: 8 }), // Random description
    price: faker.number.int({ min: 20, max: 150 }), // Random price between 20-150
    duration: faker.number.int({ min: 30, max: 120 }), // Random duration between 30-120 minutes
    createdAt: now,
    updatedAt: now
  };
}

function generateEmployee(businessId: string, index: number): EmployeeData {
  const now = new Date().toISOString();
  const employeeId = uuidv4();

  return {
    pk: `business#${businessId}#type#employee`,
    sk: employeeId,
    name: faker.person.fullName(), // Random full name using faker
    createdAt: now,
    updatedAt: now
  };
}

async function seedData(businessId: string, numServices: number, numEmployees: number) {
  if (!businessId) {
    throw new Error('Business ID is required');
  }

  if (numServices < 0 || numEmployees < 0) {
    throw new Error('Number of services and employees must be non-negative');
  }

  const tableName = process.env.BARBER_TABLE_NAME || 'BarberTable';

  console.log(`Seeding data for business: ${businessId}`);
  console.log(`Table: ${tableName}`);
  console.log(`Services to create: ${numServices}`);
  console.log(`Employees to create: ${numEmployees}`);

  const client = new DynamoDBClient({});
  const dynamoClient = DynamoDBDocumentClient.from(client);

  try {
    // Seed services
    console.log('\nSeeding services...');
    for (let i = 0; i < numServices; i++) {
      const service = generateService(businessId, i);
      const command = new PutCommand({
        TableName: tableName,
        Item: service
      });

      await dynamoClient.send(command);
      console.log(`✓ Created service: ${service.name} (ID: ${service.sk})`);
    }

    // Seed employees
    console.log('\nSeeding employees...');
    for (let i = 0; i < numEmployees; i++) {
      const employee = generateEmployee(businessId, i);
      const command = new PutCommand({
        TableName: tableName,
        Item: employee
      });

      await dynamoClient.send(command);
      console.log(`✓ Created employee: ${employee.name} (ID: ${employee.sk})`);
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log(`Created ${numServices} services and ${numEmployees} employees for business ${businessId}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error('Usage: ts-node seed-data.ts <businessId> <numServices> <numEmployees>');
    console.error('Example: ts-node seed-data.ts business123 5 3');
    process.exit(1);
  }

  const businessId = args[0];
  const numServices = parseInt(args[1], 10);
  const numEmployees = parseInt(args[2], 10);

  if (isNaN(numServices) || isNaN(numEmployees)) {
    console.error('numServices and numEmployees must be valid numbers');
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
    console.error('Failed to seed data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { seedData, generateService, generateEmployee };
