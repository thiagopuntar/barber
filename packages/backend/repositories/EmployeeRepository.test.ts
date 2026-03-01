import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import Employee from "../models/Employee";
import { EmployeeRepository } from "./EmployeeRepository";

// Mock the AWS SDK
jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/lib-dynamodb");

const mockedDynamoDBDocumentClient = DynamoDBDocumentClient as jest.Mocked<
  typeof DynamoDBDocumentClient
>;
const mockedQueryCommand = QueryCommand as jest.MockedClass<typeof QueryCommand>;
const mockedGetCommand = GetCommand as jest.MockedClass<typeof GetCommand>;

describe("EmployeeRepository", () => {
  let repository: EmployeeRepository;
  let mockSend: jest.Mock;
  const tableName = "test-table";

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup DynamoDBDocumentClient mock
    mockSend = jest.fn();
    mockedDynamoDBDocumentClient.from.mockReturnValue({
      send: mockSend,
    } as any);

    repository = new EmployeeRepository(tableName);
  });

  describe("getEmployeesByBusinessId", () => {
    const businessId = "business-123";

    it("should successfully retrieve and map employees", async () => {
      // Arrange
      const mockDynamoItems = [
        {
          pk: "business-123#employee",
          sk: "emp-1",
          name: "John Doe",
          availability: [],
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-02T00:00:00Z",
        },
        {
          pk: "business-123#employee",
          sk: "emp-2",
          name: "Jane Smith",
          availability: [],
          createdAt: "2023-01-03T00:00:00Z",
          updatedAt: "2023-01-04T00:00:00Z",
        },
      ];

      const mockQueryResult = {
        Items: mockDynamoItems,
      };

      mockSend.mockResolvedValue(mockQueryResult);

      // Act
      const result = await repository.getEmployeesByBusinessId(businessId);

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.any(QueryCommand));

      // Verify the QueryCommand was constructed correctly
      const queryCommand = mockedQueryCommand.mock.instances[0];
      expect(queryCommand).toBeDefined();

      const expectedEmployee1 = new Employee();
      expectedEmployee1.id = "emp-1";
      expectedEmployee1.name = "John Doe";
      expectedEmployee1.createdAt = new Date("2023-01-01T00:00:00Z");
      expectedEmployee1.updatedAt = new Date("2023-01-02T00:00:00Z");

      const expectedEmployee2 = new Employee();
      expectedEmployee2.id = "emp-2";
      expectedEmployee2.name = "Jane Smith";
      expectedEmployee2.createdAt = new Date("2023-01-03T00:00:00Z");
      expectedEmployee2.updatedAt = new Date("2023-01-04T00:00:00Z");

      const expectedEmployees: Employee[] = [expectedEmployee1, expectedEmployee2];

      expect(result).toEqual(expectedEmployees);
    });

    it("should return empty array when no employees found", async () => {
      // Arrange
      const mockQueryResult = {
        Items: [],
      };

      mockSend.mockResolvedValue(mockQueryResult);

      // Act
      const result = await repository.getEmployeesByBusinessId(businessId);

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it("should return empty array when Items is undefined", async () => {
      // Arrange
      const mockQueryResult = {
        Items: undefined,
      };

      mockSend.mockResolvedValue(mockQueryResult);

      // Act
      const result = await repository.getEmployeesByBusinessId(businessId);

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it("should construct correct partition key", async () => {
      // Arrange
      const mockQueryResult = {
        Items: [],
      };

      mockSend.mockResolvedValue(mockQueryResult);

      // Act
      await repository.getEmployeesByBusinessId(businessId);

      // Assert
      expect(mockedQueryCommand).toHaveBeenCalledWith({
        TableName: tableName,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": `${businessId}#employee`,
        },
      });
    });

    it("should handle DynamoDB errors properly", async () => {
      // Arrange
      const mockError = new Error("DynamoDB connection failed");
      mockSend.mockRejectedValue(mockError);

      // Act & Assert
      await expect(repository.getEmployeesByBusinessId(businessId)).rejects.toThrow(
        "DynamoDB connection failed"
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it("should properly map DynamoDB item to Employee object", async () => {
      // Arrange
      const mockDynamoItem = {
        pk: "business-123#employee",
        sk: "unique-id-123",
        name: "Test Employee",
        availability: [],
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-16T14:45:00Z",
      };

      const mockQueryResult = {
        Items: [mockDynamoItem],
      };

      mockSend.mockResolvedValue(mockQueryResult);

      // Act
      const result = await repository.getEmployeesByBusinessId(businessId);

      // Assert
      expect(result).toHaveLength(1);
      const employee = result[0];
      expect(employee.id).toBe("unique-id-123");
      expect(employee.name).toBe("Test Employee");
      expect(employee.createdAt).toEqual(new Date("2024-01-15T10:30:00Z"));
      expect(employee.updatedAt).toEqual(new Date("2024-01-16T14:45:00Z"));
    });
  });

  describe("getEmployee", () => {
    const businessId = "business-123";
    const employeeId = "emp-123";

    it("should successfully retrieve and map an employee", async () => {
      // Arrange
      const mockDynamoItem = {
        pk: "business-123#employee",
        sk: "emp-123",
        name: "John Doe",
        availability: [
          {
            weekDay: 1,
            range: [{ start: "09:00", end: "17:00" }],
          },
        ],
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-02T00:00:00Z",
      };

      mockSend.mockResolvedValue({ Item: mockDynamoItem });

      // Act
      const result = await repository.getEmployee(businessId, employeeId);

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.any(GetCommand));

      expect(mockedGetCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          pk: "business-123#employee",
          sk: employeeId,
        },
      });

      expect(result).toBeInstanceOf(Employee);
      expect(result.id).toBe(employeeId);
      expect(result.name).toBe("John Doe");
      expect(result.availability).toEqual(mockDynamoItem.availability);
      expect(result.createdAt).toEqual(new Date(mockDynamoItem.createdAt));
      expect(result.updatedAt).toEqual(new Date(mockDynamoItem.updatedAt));
    });

    it("should throw an error when employee is not found", async () => {
      // Arrange
      mockSend.mockResolvedValue({ Item: undefined });

      // Act & Assert
      await expect(repository.getEmployee(businessId, employeeId)).rejects.toThrow(
        "Employee not found"
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it("should handle DynamoDB errors properly", async () => {
      // Arrange
      const mockError = new Error("DynamoDB error");
      mockSend.mockRejectedValue(mockError);

      // Act & Assert
      await expect(repository.getEmployee(businessId, employeeId)).rejects.toThrow(
        "DynamoDB error"
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });
});
