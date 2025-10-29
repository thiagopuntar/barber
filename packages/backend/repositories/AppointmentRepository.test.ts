import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import Appointment from "../models/Appointment";
import AppointmentRepository from "./AppointmentRepository";

// Mock the AWS SDK
jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/lib-dynamodb");

const mockedDynamoDBDocumentClient = DynamoDBDocumentClient as jest.Mocked<
  typeof DynamoDBDocumentClient
>;
const mockedQueryCommand = QueryCommand as jest.MockedClass<typeof QueryCommand>;

describe("AppointmentRepository", () => {
  let repository: AppointmentRepository;
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

    repository = new AppointmentRepository(tableName);
  });

  describe("getAppointmentsByEmployeeIdAndDate", () => {
    const businessId = "business-123";
    const employeeId = "employee-456";
    const date = new Date("2024-01-15");

    it("should successfully retrieve and map appointments", async () => {
      // Arrange
      const mockDynamoItems = [
        {
          pk: "business#business-123#type#appointment",
          sk: "employee#employee-456#date#2024-01-15#time#10:00",
          id: "appointment-1",
          date: "2024-01-15T00:00:00.000Z",
          initialTime: "10:00",
          finalTime: "11:00",
          createdAt: "2024-01-15T08:00:00.000Z",
          updatedAt: "2024-01-15T08:30:00.000Z",
        },
        {
          pk: "business#business-123#type#appointment",
          sk: "employee#employee-456#date#2024-01-15#time#14:00",
          id: "appointment-2",
          date: "2024-01-15T00:00:00.000Z",
          initialTime: "14:00",
          finalTime: "15:30",
          createdAt: "2024-01-15T12:00:00.000Z",
          updatedAt: "2024-01-15T12:15:00.000Z",
        },
      ];

      mockSend.mockResolvedValue({
        Items: mockDynamoItems,
      });

      // Act
      const result = await repository.getAppointmentsByEmployeeIdAndDate(
        businessId,
        employeeId,
        date
      );

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockedQueryCommand).toHaveBeenCalledWith({
        TableName: tableName,
        KeyConditionExpression: "pk = :pk and sk = begins_with(:sk)",
        ExpressionAttributeValues: {
          ":pk": `business#${businessId}#type#appointment`,
          ":sk": `employee#${employeeId}#date#${date.toISOString().split("T")[0]}`,
        },
      });

      expect(result).toHaveLength(2);

      // Check first appointment mapping
      expect(result[0]).toBeInstanceOf(Appointment);
      expect(result[0].id).toBe("appointment-1");
      expect(result[0].date).toEqual(new Date("2024-01-15T00:00:00.000Z"));
      expect(result[0].initialTime).toBe("10:00");
      expect(result[0].finalTime).toBe("11:00");
      expect(result[0].createdAt).toEqual(new Date("2024-01-15T08:00:00.000Z"));
      expect(result[0].updatedAt).toEqual(new Date("2024-01-15T08:30:00.000Z"));

      // Check second appointment mapping
      expect(result[1]).toBeInstanceOf(Appointment);
      expect(result[1].id).toBe("appointment-2");
      expect(result[1].date).toEqual(new Date("2024-01-15T00:00:00.000Z"));
      expect(result[1].initialTime).toBe("14:00");
      expect(result[1].finalTime).toBe("15:30");
      expect(result[1].createdAt).toEqual(new Date("2024-01-15T12:00:00.000Z"));
      expect(result[1].updatedAt).toEqual(new Date("2024-01-15T12:15:00.000Z"));
    });

    it("should return empty array when no appointments are found", async () => {
      // Arrange
      mockSend.mockResolvedValue({
        Items: undefined,
      });

      // Act
      const result = await repository.getAppointmentsByEmployeeIdAndDate(
        businessId,
        employeeId,
        date
      );

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it("should return empty array when Items is an empty array", async () => {
      // Arrange
      mockSend.mockResolvedValue({
        Items: [],
      });

      // Act
      const result = await repository.getAppointmentsByEmployeeIdAndDate(
        businessId,
        employeeId,
        date
      );

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it("should handle DynamoDB errors and rethrow them", async () => {
      // Arrange
      const mockError = new Error("DynamoDB connection failed");
      mockSend.mockRejectedValue(mockError);

      // Act & Assert
      await expect(
        repository.getAppointmentsByEmployeeIdAndDate(businessId, employeeId, date)
      ).rejects.toThrow("DynamoDB connection failed");
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it("should construct correct partition key", async () => {
      // Arrange
      mockSend.mockResolvedValue({ Items: [] });

      // Act
      await repository.getAppointmentsByEmployeeIdAndDate(businessId, employeeId, date);

      // Assert
      expect(mockedQueryCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          ExpressionAttributeValues: expect.objectContaining({
            ":pk": `business#${businessId}#type#appointment`,
          }),
        })
      );
    });

    it("should construct correct sort key prefix", async () => {
      // Arrange
      mockSend.mockResolvedValue({ Items: [] });

      // Act
      await repository.getAppointmentsByEmployeeIdAndDate(businessId, employeeId, date);

      // Assert
      expect(mockedQueryCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          ExpressionAttributeValues: expect.objectContaining({
            ":sk": `employee#${employeeId}#date#${date.toISOString().split("T")[0]}`,
          }),
        })
      );
    });

    it("should handle different date formats correctly", async () => {
      // Arrange
      const dateWithTime = new Date("2024-01-15T15:30:45.123Z");
      mockSend.mockResolvedValue({ Items: [] });

      // Act
      await repository.getAppointmentsByEmployeeIdAndDate(businessId, employeeId, dateWithTime);

      // Assert
      expect(mockedQueryCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          ExpressionAttributeValues: expect.objectContaining({
            ":sk": `employee#${employeeId}#date#2024-01-15`,
          }),
        })
      );
    });

    it("should correctly map all appointment properties", async () => {
      // Arrange
      const mockDynamoItem = {
        pk: "business#business-123#type#appointment",
        sk: "employee#employee-456#date#2024-01-15#time#09:00",
        id: "appointment-test",
        date: "2024-01-15T00:00:00.000Z",
        initialTime: "09:00",
        finalTime: "10:00",
        createdAt: "2024-01-14T20:00:00.000Z",
        updatedAt: "2024-01-14T21:00:00.000Z",
      };

      mockSend.mockResolvedValue({
        Items: [mockDynamoItem],
      });

      // Act
      const result = await repository.getAppointmentsByEmployeeIdAndDate(
        businessId,
        employeeId,
        date
      );

      // Assert
      expect(result).toHaveLength(1);
      const appointment = result[0];
      expect(appointment.id).toBe("appointment-test");
      expect(appointment.date).toEqual(new Date("2024-01-15T00:00:00.000Z"));
      expect(appointment.initialTime).toBe("09:00");
      expect(appointment.finalTime).toBe("10:00");
      expect(appointment.createdAt).toEqual(new Date("2024-01-14T20:00:00.000Z"));
      expect(appointment.updatedAt).toEqual(new Date("2024-01-14T21:00:00.000Z"));
    });

    it("should handle multiple appointments for the same employee and date", async () => {
      // Arrange
      const mockDynamoItems = [
        {
          pk: "business#business-123#type#appointment",
          sk: "employee#employee-456#date#2024-01-15#time#09:00",
          id: "appointment-morning",
          date: "2024-01-15T00:00:00.000Z",
          initialTime: "09:00",
          finalTime: "10:00",
          createdAt: "2024-01-14T20:00:00.000Z",
          updatedAt: "2024-01-14T21:00:00.000Z",
        },
        {
          pk: "business#business-123#type#appointment",
          sk: "employee#employee-456#date#2024-01-15#time#11:00",
          id: "appointment-late-morning",
          date: "2024-01-15T00:00:00.000Z",
          initialTime: "11:00",
          finalTime: "12:00",
          createdAt: "2024-01-14T20:15:00.000Z",
          updatedAt: "2024-01-14T21:15:00.000Z",
        },
        {
          pk: "business#business-123#type#appointment",
          sk: "employee#employee-456#date#2024-01-15#time#14:00",
          id: "appointment-afternoon",
          date: "2024-01-15T00:00:00.000Z",
          initialTime: "14:00",
          finalTime: "15:30",
          createdAt: "2024-01-14T20:30:00.000Z",
          updatedAt: "2024-01-14T21:30:00.000Z",
        },
      ];

      mockSend.mockResolvedValue({
        Items: mockDynamoItems,
      });

      // Act
      const result = await repository.getAppointmentsByEmployeeIdAndDate(
        businessId,
        employeeId,
        date
      );

      // Assert
      expect(result).toHaveLength(3);
      expect(result.map(a => a.id)).toEqual([
        "appointment-morning",
        "appointment-late-morning",
        "appointment-afternoon",
      ]);
      expect(result.map(a => a.initialTime)).toEqual(["09:00", "11:00", "14:00"]);
      expect(result.map(a => a.finalTime)).toEqual(["10:00", "12:00", "15:30"]);
    });
  });
});
