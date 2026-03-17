import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { BusinessRepository } from "./BusinessRepository";
import Business from "../models/Business";

// Mock the AWS SDK
jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/lib-dynamodb");

const mockedDynamoDBDocumentClient = DynamoDBDocumentClient as jest.Mocked<
  typeof DynamoDBDocumentClient
>;
const mockedGetCommand = GetCommand as jest.MockedClass<typeof GetCommand>;
const mockedQueryCommand = QueryCommand as jest.MockedClass<typeof QueryCommand>;

describe("BusinessRepository", () => {
  let repository: BusinessRepository;
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

    repository = new BusinessRepository(tableName);
  });

  describe("getById", () => {
    const businessId = "business-123";

    it("should successfully retrieve and map a business", async () => {
      // Arrange
      const mockDynamoItem = {
        pk: "business",
        sk: businessId,
        name: "Test Barbershop",
        description: "A cool place to get a haircut",
        image: "https://example.com/image.jpg",
        url: "https://example.com",
        address: "123 Main St",
        city: "Barberton",
        state: "CA",
        zip: "90210",
        country: "USA",
        phone: "555-1234",
        email: "contact@testbarber.com",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-16T14:45:00Z",
      };

      mockSend.mockResolvedValue({
        Item: mockDynamoItem,
      });

      // Act
      const result = await repository.getById(businessId);

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.any(GetCommand));

      expect(result).toBeInstanceOf(Business);
      expect(result?.toJSON()).toEqual({
        id: businessId,
        name: "Test Barbershop",
        description: "A cool place to get a haircut",
        image: "https://example.com/image.jpg",
        url: "https://example.com",
        address: "123 Main St",
        city: "Barberton",
        state: "CA",
        zip: "90210",
        country: "USA",
        phone: "555-1234",
        email: "contact@testbarber.com",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-16T14:45:00Z"),
      });
    });

    it("should return null when business is not found", async () => {
      // Arrange
      mockSend.mockResolvedValue({
        Item: undefined,
      });

      // Act
      const result = await repository.getById(businessId);

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it("should construct correct partition and sort key", async () => {
      // Arrange
      mockSend.mockResolvedValue({
        Item: undefined,
      });

      // Act
      await repository.getById(businessId);

      // Assert
      expect(mockedGetCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          pk: "business",
          sk: businessId,
        },
      });
    });

    it("should handle DynamoDB errors properly", async () => {
      // Arrange
      const mockError = new Error("DynamoDB connection failed");
      mockSend.mockRejectedValue(mockError);

      // Act & Assert
      await expect(repository.getById(businessId)).rejects.toThrow(
        "DynamoDB connection failed"
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });

  describe("getAll", () => {
    it("should successfully retrieve and map businesses", async () => {
      // Arrange
      const mockDynamoItems = [
        {
          pk: "business",
          sk: "business-1",
          name: "Business One",
          description: "Description one",
          image: "https://example.com/one.jpg",
          url: "https://business-one.com",
          address: "123 Main St",
          city: "City One",
          state: "CA",
          zip: "90001",
          country: "USA",
          phone: "111-111-1111",
          email: "one@example.com",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-16T14:45:00Z",
        },
        {
          pk: "business",
          sk: "business-2",
          name: "Business Two",
          description: "Description two",
          image: "https://example.com/two.jpg",
          url: "https://business-two.com",
          address: "456 Market St",
          city: "City Two",
          state: "NY",
          zip: "10001",
          country: "USA",
          phone: "222-222-2222",
          email: "two@example.com",
          createdAt: "2024-02-01T09:00:00Z",
          updatedAt: "2024-02-02T12:00:00Z",
        },
      ];

      mockSend.mockResolvedValue({
        Items: mockDynamoItems,
      });

      // Act
      const result = await repository.getAll();

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.any(QueryCommand));
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Business);
      expect(result[1]).toBeInstanceOf(Business);
      expect(result[0].toJSON()).toEqual({
        id: "business-1",
        name: "Business One",
        description: "Description one",
        image: "https://example.com/one.jpg",
        url: "https://business-one.com",
        address: "123 Main St",
        city: "City One",
        state: "CA",
        zip: "90001",
        country: "USA",
        phone: "111-111-1111",
        email: "one@example.com",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-16T14:45:00Z"),
      });
      expect(result[1].toJSON()).toEqual({
        id: "business-2",
        name: "Business Two",
        description: "Description two",
        image: "https://example.com/two.jpg",
        url: "https://business-two.com",
        address: "456 Market St",
        city: "City Two",
        state: "NY",
        zip: "10001",
        country: "USA",
        phone: "222-222-2222",
        email: "two@example.com",
        createdAt: new Date("2024-02-01T09:00:00Z"),
        updatedAt: new Date("2024-02-02T12:00:00Z"),
      });
    });

    it("should return empty array when Items is undefined", async () => {
      // Arrange
      mockSend.mockResolvedValue({
        Items: undefined,
      });

      // Act
      const result = await repository.getAll();

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it("should return empty array when no businesses are found", async () => {
      // Arrange
      mockSend.mockResolvedValue({
        Items: [],
      });

      // Act
      const result = await repository.getAll();

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it("should construct correct query partition key", async () => {
      // Arrange
      mockSend.mockResolvedValue({
        Items: [],
      });

      // Act
      await repository.getAll();

      // Assert
      expect(mockedQueryCommand).toHaveBeenCalledWith({
        TableName: tableName,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": "business",
        },
      });
    });

    it("should handle DynamoDB errors properly", async () => {
      // Arrange
      const mockError = new Error("DynamoDB connection failed");
      mockSend.mockRejectedValue(mockError);

      // Act & Assert
      await expect(repository.getAll()).rejects.toThrow("DynamoDB connection failed");
      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });
});
