import Employee from "./Employee";

describe("Employee", () => {
  let employee: Employee;
  const employeeId = "emp-123";
  const employeeName = "John Doe";
  const createdAt = new Date("2024-01-01T00:00:00Z");
  const updatedAt = new Date("2024-01-02T00:00:00Z");

  beforeEach(() => {
    employee = new Employee({
      id: employeeId,
      name: employeeName,
      createdAt,
      updatedAt,
    });
  });

  describe("constructor and getters", () => {
    it("should correctly initialize employee properties", () => {
      expect(employee.id).toBe(employeeId);
      expect(employee.name).toBe(employeeName);
      expect(employee.createdAt).toBe(createdAt);
      expect(employee.updatedAt).toBe(updatedAt);
    });
  });

  describe("availability", () => {
    it("should add and retrieve availability correctly", () => {
      const availability1 = {
        weekDay: 1, // Monday
        range: [{ start: "09:00", end: "12:00" }],
      };
      const availability2 = {
        weekDay: 3, // Wednesday
        range: [{ start: "10:00", end: "16:00" }],
      };

      employee.addAvailability(availability1, availability2);

      expect(employee.getAvailabilityForWeekDay(1)).toEqual(availability1);
      expect(employee.getAvailabilityForWeekDay(3)).toEqual(availability2);
      expect(employee.getAvailabilityForWeekDay(2)).toBeUndefined();
    });

    describe("hasAvailabilityForSlot", () => {
      beforeEach(() => {
        const availability = {
          weekDay: 1, // Monday
          range: [
            { start: "09:00", end: "12:00" },
            { start: "14:00", end: "18:00" },
          ],
        };
        employee.addAvailability(availability);
      });

      it("should return true when slot is exactly the same as availability range", () => {
        const date = new Date("2024-01-01T10:00:00Z"); // A Monday
        const result = employee.hasAvailabilityForSlot({
          date,
          initialTime: "09:00",
          endTime: "12:00",
        });
        expect(result).toBe(true);
      });

      it("should return true when slot is inside availability range", () => {
        const date = new Date("2024-01-01T10:00:00Z"); // A Monday
        const result = employee.hasAvailabilityForSlot({
          date,
          initialTime: "10:00",
          endTime: "11:00",
        });
        expect(result).toBe(true);
      });

      it("should return true when slot is inside another availability range", () => {
        const date = new Date("2024-01-01T10:00:00Z"); // A Monday
        const result = employee.hasAvailabilityForSlot({
          date,
          initialTime: "15:00",
          endTime: "16:00",
        });
        expect(result).toBe(true);
      });

      it("should return false when slot is outside availability range", () => {
        const date = new Date("2024-01-01T10:00:00Z"); // A Monday
        const result = employee.hasAvailabilityForSlot({
          date,
          initialTime: "12:00",
          endTime: "13:00",
        });
        expect(result).toBe(false);
      });

      it("should return false when slot partially overlaps before range", () => {
        const date = new Date("2024-01-01T10:00:00Z"); // A Monday
        const result = employee.hasAvailabilityForSlot({
          date,
          initialTime: "08:30",
          endTime: "10:00",
        });
        expect(result).toBe(false);
      });

      it("should return false when slot partially overlaps after range", () => {
        const date = new Date("2024-01-01T10:00:00Z"); // A Monday
        const result = employee.hasAvailabilityForSlot({
          date,
          initialTime: "11:30",
          endTime: "12:30",
        });
        expect(result).toBe(false);
      });

      it("should return false when no availability for that weekday", () => {
        const date = new Date("2024-01-02T10:00:00Z"); // A Tuesday
        const result = employee.hasAvailabilityForSlot({
          date,
          initialTime: "09:00",
          endTime: "10:00",
        });
        expect(result).toBe(false);
      });
    });
  });

  describe("toJSON", () => {
    it("should return correct JSON representation", () => {
      const json = employee.toJSON();
      expect(json).toEqual({
        id: employeeId,
        name: employeeName,
        createdAt,
        updatedAt,
      });
    });
  });
});
