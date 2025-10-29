# Database Seeding Scripts

## Seed Data Script

The `seed-data.ts` script is used to populate the DynamoDB table with mock services and employees for testing purposes.

### Usage

```bash
# Using npm script
npm run seed <businessId> <numServices> <numEmployees>

# Or directly with ts-node
npx ts-node scripts/seed-data.ts <businessId> <numServices> <numEmployees>
```

### Parameters

- `businessId`: The business identifier (required)
- `numServices`: Number of mock services to create (required)
- `numEmployees`: Number of mock employees to create (required)

### Examples

```bash
# Create 5 services and 3 employees for business "barber123"
npm run seed barber123 5 3

# Create 10 services and 5 employees for business "salon456"
npm run seed salon456 10 5
```

### Environment Variables

The script uses the following environment variable:

- `BARBER_TABLE_NAME`: DynamoDB table name (defaults to "BarberTable")

Make sure you have AWS credentials configured and the DynamoDB table deployed before running the script.

### Data Structure

#### Services

- **pk**: `business#{businessId}#type#service`
- **sk**: UUID for the service
- **name**: Random service name from predefined list
- **description**: Service description
- **price**: Random price between 20-120
- **duration**: Random duration between 30-90 minutes
- **createdAt**: ISO timestamp
- **updatedAt**: ISO timestamp

#### Employees

- **pk**: `business#{businessId}#type#employee`
- **sk**: UUID for the employee
- **name**: Random employee name from predefined list
- **createdAt**: ISO timestamp
- **updatedAt**: ISO timestamp
