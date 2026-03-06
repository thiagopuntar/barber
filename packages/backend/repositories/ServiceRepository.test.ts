import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import Service from "../models/Service";
import ServiceRepository from "./ServiceRepository";

// Mock the AWS SDK
jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/lib-dynamodb");

const mockedDynamoDBDocumentClient = DynamoDBDocumentClient as jest.Mocked<
  typeof DynamoDBDocumentClient
>;
const mockedQueryCommand = QueryCommand as jest.MockedClass<typeof QueryCommand>;
const mockedGetCommand = GetCommand as jest.MockedClass<typeof GetCommand>;

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

  describe("getAllByBusinessId", () => {
    const businessId = "business-123";

    it("should successfully retrieve and map services", async () => {
      // Arrange
      const mockDynamoItems = [
        {
          pk: "business-123#service",
          sk: "svc-1",
          name: "Haircut",
          description: "Basic haircut service",
          price: 25.0,
          duration: 30,
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-02T00:00:00Z",
        },
        {
          pk: "business-123#service",
          sk: "svc-2",
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
      const result = await repository.getAllByBusinessId(businessId);

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.any(QueryCommand));

      const expectedService1 = new Service({
        id: "svc-1",
        name: "Haircut",
        description: "Basic haircut service",
        price: 25.0,
        duration: 30,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-02T00:00:00Z"),
      });

      const expectedService2 = new Service({
        id: "svc-2",
        name: "Shampoo",
        description: "Hair washing and shampoo",
        price: 15.0,
        duration: 15,
        createdAt: new Date("2023-01-03T00:00:00Z"),
        updatedAt: new Date("2023-01-04T00:00:00Z"),
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expectedService1);
      expect(result[1]).toEqual(expectedService2);
    });

    it("should return empty array when no services found", async () => {
      // Arrange
      const mockQueryResult = {
        Items: [],
      };

      mockSend.mockResolvedValue(mockQueryResult);

      // Act
      const result = await repository.getAllByBusinessId(businessId);

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
      const result = await repository.getAllByBusinessId(businessId);

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
      await repository.getAllByBusinessId(businessId);

      // Assert
      expect(mockedQueryCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          ExpressionAttributeValues: {
            ":pk": `${businessId}#service`,
          },
        })
      );
    });

    it("should handle DynamoDB errors properly", async () => {
      // Arrange
      const mockError = new Error("DynamoDB connection failed");
      mockSend.mockRejectedValue(mockError);

      // Act & Assert
      await expect(repository.getAllByBusinessId(businessId)).rejects.toThrow(
        "DynamoDB connection failed"
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });

  describe("getById", () => {
    const businessId = "business-123";
    const serviceId = "svc-123";

    it("should successfully retrieve and map a service", async () => {
      // Arrange
      const mockDynamoItem = {
        pk: "business-123#service",
        sk: "svc-123",
        name: "Test Service",
        description: "Test description",
        price: 100,
        duration: 60,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-02T00:00:00Z",
      };

      mockSend.mockResolvedValue({ Item: mockDynamoItem });

      // Act
      const result = await repository.getById(businessId, serviceId);

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.any(GetCommand));

      expect(result).toBeInstanceOf(Service);
      expect(result.id).toBe(serviceId);
      expect(result.name).toBe("Test Service");
      expect(result.description).toBe("Test description");
      expect(result.price).toBe(100);
      expect(result.duration).toBe(60);
      expect(result.createdAt).toEqual(new Date(mockDynamoItem.createdAt));
      expect(result.updatedAt).toEqual(new Date(mockDynamoItem.updatedAt));
    });

    it("should throw an error when service is not found", async () => {
      // Arrange
      mockSend.mockResolvedValue({ Item: undefined });

      // Act & Assert
      await expect(repository.getById(businessId, serviceId)).rejects.toThrow(
        "Service not found"
      );
    });
  });
});
