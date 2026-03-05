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
