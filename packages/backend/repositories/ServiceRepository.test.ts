import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import Service from "../models/Service";
import ServiceRepository from "./ServiceRepository";

// Mock the AWS SDK
jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/lib-dynamodb");

const mockedDynamoDBDocumentClient = DynamoDBDocumentClient as jest.Mocked<
  typeof DynamoDBDocumentClient
>;
const mockedQueryCommand = QueryCommand as jest.MockedClass<typeof QueryCommand>;

describe("ServiceRepository", () => {
  let repository: ServiceRepository;
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

    repository = new ServiceRepository(tableName);
  });

  describe("getServicesByBusinessId", () => {
    const businessId = "business-123";

    it("should successfully retrieve and map services", async () => {
      // Arrange
      const mockDynamoItems = [
        {
          pk: "business#business-123#type#service",
          sk: "service#svc-1",
          name: "Haircut",
          description: "Basic haircut service",
          price: 25.0,
          duration: 30,
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-02T00:00:00Z",
        },
        {
          pk: "business#business-123#type#service",
          sk: "service#svc-2",
          name: "Shampoo",
          description: "Hair washing and shampoo",
          price: 15.0,
          duration: 15,
          createdAt: "2023-01-03T00:00:00Z",
          updatedAt: "2023-01-04T00:00:00Z",
        },
      ];

      const mockQueryResult = {
        Items: mockDynamoItems,
      };

      mockSend.mockResolvedValue(mockQueryResult);

      // Act
      const result = await repository.getServicesByBusinessId(businessId);

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.any(QueryCommand));

      // Verify the QueryCommand was constructed correctly
      const queryCommand = mockedQueryCommand.mock.instances[0];
      expect(queryCommand).toBeDefined();

      const expectedServices: Service[] = [
        {
          id: "svc-1",
          name: "Haircut",
          description: "Basic haircut service",
          price: 25.0,
          duration: 30,
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-02T00:00:00Z"),
        },
        {
          id: "svc-2",
          name: "Shampoo",
          description: "Hair washing and shampoo",
          price: 15.0,
          duration: 15,
          createdAt: new Date("2023-01-03T00:00:00Z"),
          updatedAt: new Date("2023-01-04T00:00:00Z"),
        },
      ];

      expect(result).toEqual(expectedServices);
    });

    it("should return empty array when no services found", async () => {
      // Arrange
      const mockQueryResult = {
        Items: [],
      };

      mockSend.mockResolvedValue(mockQueryResult);

      // Act
      const result = await repository.getServicesByBusinessId(businessId);

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
      const result = await repository.getServicesByBusinessId(businessId);

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
      await repository.getServicesByBusinessId(businessId);

      // Assert
      expect(mockedQueryCommand).toHaveBeenCalledWith({
        TableName: tableName,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": `business#${businessId}#type#service`,
        },
      });
    });

    it("should handle DynamoDB errors properly", async () => {
      // Arrange
      const mockError = new Error("DynamoDB connection failed");
      mockSend.mockRejectedValue(mockError);

      // Act & Assert
      await expect(repository.getServicesByBusinessId(businessId)).rejects.toThrow(
        "DynamoDB connection failed"
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it("should properly map DynamoDB item to Service object", async () => {
      // Arrange
      const mockDynamoItem = {
        pk: "business#business-123#type#service",
        sk: "service#unique-service-id",
        name: "Test Service",
        description: "A test service description",
        price: 50.0,
        duration: 60,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-16T14:45:00Z",
      };

      const mockQueryResult = {
        Items: [mockDynamoItem],
      };

      mockSend.mockResolvedValue(mockQueryResult);

      // Act
      const result = await repository.getServicesByBusinessId(businessId);

      // Assert
      expect(result).toHaveLength(1);
      const service = result[0];
      expect(service.id).toBe("unique-service-id");
      expect(service.name).toBe("Test Service");
      expect(service.description).toBe("A test service description");
      expect(service.price).toBe(50.0);
      expect(service.duration).toBe(60);
      expect(service.createdAt).toEqual(new Date("2024-01-15T10:30:00Z"));
      expect(service.updatedAt).toEqual(new Date("2024-01-16T14:45:00Z"));
    });
  });
});
