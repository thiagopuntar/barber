import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { BusinessRepository } from "./BusinessRepository";
import Business from "../models/Business";

// Mock the AWS SDK
jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/lib-dynamodb");

const mockedDynamoDBDocumentClient = DynamoDBDocumentClient as jest.Mocked<
  typeof DynamoDBDocumentClient
>;
const mockedGetCommand = GetCommand as jest.MockedClass<typeof GetCommand>;

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

  describe("getBusinessById", () => {
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
      const result = await repository.getBusinessById(businessId);

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.any(GetCommand));

      expect(result).toBeInstanceOf(Business);
      expect(result?.id).toBe(businessId);
      expect(result?.name).toBe("Test Barbershop");
      expect(result?.description).toBe("A cool place to get a haircut");
      expect(result?.image).toBe("https://example.com/image.jpg");
      expect(result?.address).toBe("123 Main St");
      expect(result?.city).toBe("Barberton");
      expect(result?.state).toBe("CA");
      expect(result?.zip).toBe("90210");
      expect(result?.country).toBe("USA");
      expect(result?.phone).toBe("555-1234");
      expect(result?.email).toBe("contact@testbarber.com");
      expect(result?.createdAt).toEqual(new Date("2024-01-15T10:30:00Z"));
      expect(result?.updatedAt).toEqual(new Date("2024-01-16T14:45:00Z"));
    });

    it("should return null when business is not found", async () => {
      // Arrange
      mockSend.mockResolvedValue({
        Item: undefined,
      });

      // Act
      const result = await repository.getBusinessById(businessId);

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
      await repository.getBusinessById(businessId);

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
      await expect(repository.getBusinessById(businessId)).rejects.toThrow(
        "DynamoDB connection failed"
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });
});
