import Employee from "./Employee";
import Appointment from "./Appointment";

describe("Employee", () => {
    let employee: Employee;
    let mockAppointment1: Appointment;
    let mockAppointment2: Appointment;
    let mockAppointment3: Appointment;

    beforeEach(() => {
        // Create a mock employee instance
        employee = new Employee();
        employee.id = "emp-123";
        employee.name = "John Doe";
        employee.createdAt = new Date("2024-01-01T00:00:00Z");
        employee.updatedAt = new Date("2024-01-02T00:00:00Z");
        employee.availability = [
            {
                weekDay: 1, // Monday
                range: [
                    { start: "09:00", end: "12:00" },
                    { start: "13:00", end: "17:00" }
                ]
            },
            {
                weekDay: 3, // Wednesday
                range: [
                    { start: "10:00", end: "16:00" }
                ]
            }
        ];

        // Create mock appointments
        mockAppointment1 = new Appointment();
        mockAppointment1.id = "appt-1";
        mockAppointment1.date = new Date("2024-01-15");
        mockAppointment1.initialTime = "10:00";
        mockAppointment1.finalTime = "11:00";
        mockAppointment1.createdAt = new Date();
        mockAppointment1.updatedAt = new Date();

        mockAppointment2 = new Appointment();
        mockAppointment2.id = "appt-2";
        mockAppointment2.date = new Date("2024-01-16");
        mockAppointment2.initialTime = "14:00";
        mockAppointment2.finalTime = "15:00";
        mockAppointment2.createdAt = new Date();
        mockAppointment2.updatedAt = new Date();

        mockAppointment3 = new Appointment();
        mockAppointment3.id = "appt-3";
        mockAppointment3.date = new Date("2024-01-17");
        mockAppointment3.initialTime = "11:00";
        mockAppointment3.finalTime = "12:00";
        mockAppointment3.createdAt = new Date();
        mockAppointment3.updatedAt = new Date();

    });

    describe("addAppointments", () => {
        it("should add appointments to an empty appointments array", () => {
            // Arrange
            const newAppointments = [mockAppointment1];

            // Act
            employee.addAppointments(newAppointments);

            // Assert
            expect((employee as any).appointments).toHaveLength(1);
            expect((employee as any).appointments[0]).toBe(mockAppointment1);
        });

        it("should merge new appointments with existing appointments", () => {
            // Arrange
            const existingAppointments = [mockAppointment1];
            (employee as any).appointments = existingAppointments;
            const newAppointments = [mockAppointment2, mockAppointment3];

            // Act
            employee.addAppointments(newAppointments);

            // Assert
            expect((employee as any).appointments).toHaveLength(3);
            expect((employee as any).appointments).toEqual([
                mockAppointment1,
                mockAppointment2,
                mockAppointment3
            ]);
        });

        it("should handle empty array input", () => {
            // Arrange
            const existingAppointments = [mockAppointment1];
            (employee as any).appointments = existingAppointments;

            // Act
            employee.addAppointments([]);

            // Assert
            expect((employee as any).appointments).toHaveLength(1);
            expect((employee as any).appointments[0]).toBe(mockAppointment1);
        });

        it("should not modify existing appointments reference when adding new ones", () => {
            // Arrange
            const existingAppointments = [mockAppointment1];
            (employee as any).appointments = existingAppointments;
            const originalAppointments = (employee as any).appointments;

            // Act
            employee.addAppointments([mockAppointment2]);

            // Assert
            expect((employee as any).appointments).not.toBe(originalAppointments);
            expect(originalAppointments).toHaveLength(1); // Original should be unchanged
            expect((employee as any).appointments).toHaveLength(2); // New array should have both
        });
    });

    describe("getSlotPerDay", () => {
        it("should return empty array when no availability exists for the given weekday", () => {
            // Arrange
            const date = new Date("2024-01-20"); // Saturday (weekday 6)
            const duration = 60;

            // Act
            const result = employee.getSlotPerDay(date, duration);

            // Assert
            expect(result).toEqual([]);
        });

        it("should return empty array when availability array is empty", () => {
            // Arrange
            employee.availability = [];
            const date = new Date("2024-01-15"); // Monday
            const duration = 60;

            // Act
            const result = employee.getSlotPerDay(date, duration);

            // Assert
            expect(result).toEqual([]);
        });

        it("should return right slots for a given day when availability exists for duration 60 minutes", () => {
            // Arrange
            const date = new Date(2024, 0, 15); // Monday (weekday 1) - using local timezone
            const duration = 60;

            // Debug: check what's set
            expect(employee.availability).toBeDefined();
            expect(employee.availability).toHaveLength(2);
            expect(date.getDay()).toBe(1); // Monday

            // Act
            const result = employee.getSlotPerDay(date, duration);

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].date).toEqual(date);
            expect(result[0].slots).toEqual([
                { start: "09:00", end: "10:00" },
                { start: "10:00", end: "11:00" },
                { start: "11:00", end: "12:00" },
                { start: "13:00", end: "14:00" },
                { start: "14:00", end: "15:00" },
                { start: "15:00", end: "16:00" },
                { start: "16:00", end: "17:00" }
            ]);
        });

        it("should handle different date formats correctly", () => {
            // Arrange
            const mondayDate = new Date(2024, 0, 15); // Monday using different constructor
            const wednesdayDate = new Date("2024-01-17T12:00:00Z"); // Wednesday with time
            const duration = 60;

            // Act
            const mondayResult = employee.getSlotPerDay(mondayDate, duration);
            const wednesdayResult = employee.getSlotPerDay(wednesdayDate, duration);

            // Assert
            expect(mondayResult).toHaveLength(1);
            expect(mondayResult[0].date).toEqual(mondayDate);
            expect(mondayResult[0].slots).toEqual([
                { start: "09:00", end: "10:00" },
                { start: "10:00", end: "11:00" },
                { start: "11:00", end: "12:00" },
                { start: "13:00", end: "14:00" },
                { start: "14:00", end: "15:00" },
                { start: "15:00", end: "16:00" },
                { start: "16:00", end: "17:00" }
            ]);

            expect(wednesdayResult).toHaveLength(1);
            expect(wednesdayResult[0].date).toEqual(wednesdayDate);
            expect(wednesdayResult[0].slots).toEqual([
                { start: "10:00", end: "11:00" },
                { start: "11:00", end: "12:00" },
                { start: "12:00", end: "13:00" },
                { start: "13:00", end: "14:00" },
                { start: "14:00", end: "15:00" },
                { start: "15:00", end: "16:00" }
            ]);
        });

        it("should correctly identify weekdays", () => {
            // Test all weekdays
            const testCases = [
                { year: 2024, month: 0, day: 14, weekday: 0, hasAvailability: false, expectedSlots: [] }, // Sunday
                { year: 2024, month: 0, day: 15, weekday: 1, hasAvailability: true, expectedSlots: [
                    { start: "09:00", end: "10:00" },
                    { start: "10:00", end: "11:00" },
                    { start: "11:00", end: "12:00" },
                    { start: "13:00", end: "14:00" },
                    { start: "14:00", end: "15:00" },
                    { start: "15:00", end: "16:00" },
                    { start: "16:00", end: "17:00" }
                ] },  // Monday
                { year: 2024, month: 0, day: 16, weekday: 2, hasAvailability: false, expectedSlots: [] }, // Tuesday
                { year: 2024, month: 0, day: 17, weekday: 3, hasAvailability: true, expectedSlots: [
                    { start: "10:00", end: "11:00" },
                    { start: "11:00", end: "12:00" },
                    { start: "12:00", end: "13:00" },
                    { start: "13:00", end: "14:00" },
                    { start: "14:00", end: "15:00" },
                    { start: "15:00", end: "16:00" }
                ] },  // Wednesday
                { year: 2024, month: 0, day: 18, weekday: 4, hasAvailability: false, expectedSlots: [] }, // Thursday
                { year: 2024, month: 0, day: 19, weekday: 5, hasAvailability: false, expectedSlots: [] }, // Friday
                { year: 2024, month: 0, day: 20, weekday: 6, hasAvailability: false, expectedSlots: [] }, // Saturday
            ];

            testCases.forEach(({ year, month, day, hasAvailability, expectedSlots }) => {
                const testDate = new Date(year, month, day);
                const result = employee.getSlotPerDay(testDate, 60);

                if (hasAvailability) {
                    expect(result).toHaveLength(1);
                    expect(result[0].date).toEqual(testDate);
                    expect(result[0].slots).toEqual(expectedSlots);
                } else {
                    expect(result).toEqual([]);
                }
            });
        });

        it("should generate slots based on duration parameter", () => {
            // Arrange
            const date = new Date(2024, 0, 15); // Monday - using local timezone
            const duration1 = 30;
            const duration2 = 60;
            const duration3 = 120;

            // Act
            const result1 = employee.getSlotPerDay(date, duration1);
            const result2 = employee.getSlotPerDay(date, duration2);
            const result3 = employee.getSlotPerDay(date, duration3);

            // Assert
            // 30-minute slots should produce more slots
            expect(result1).toHaveLength(1);
            expect(result1[0].slots).toEqual([
                { start: "09:00", end: "09:30" },
                { start: "09:30", end: "10:00" },
                { start: "10:00", end: "10:30" },
                { start: "10:30", end: "11:00" },
                { start: "11:00", end: "11:30" },
                { start: "11:30", end: "12:00" },
                { start: "13:00", end: "13:30" },
                { start: "13:30", end: "14:00" },
                { start: "14:00", end: "14:30" },
                { start: "14:30", end: "15:00" },
                { start: "15:00", end: "15:30" },
                { start: "15:30", end: "16:00" },
                { start: "16:00", end: "16:30" },
                { start: "16:30", end: "17:00" }
            ]);

            // 60-minute slots
            expect(result2).toHaveLength(1);
            expect(result2[0].slots).toEqual([
                { start: "09:00", end: "10:00" },
                { start: "10:00", end: "11:00" },
                { start: "11:00", end: "12:00" },
                { start: "13:00", end: "14:00" },
                { start: "14:00", end: "15:00" },
                { start: "15:00", end: "16:00" },
                { start: "16:00", end: "17:00" }
            ]);

            // 120-minute slots should produce fewer slots
            // Note: Slots don't span across gaps in availability
            expect(result3).toHaveLength(1);
            expect(result3[0].slots).toEqual([
                { start: "09:00", end: "11:00" },
                { start: "13:00", end: "15:00" },
                { start: "15:00", end: "17:00" }
            ]);
        });
    });

});
