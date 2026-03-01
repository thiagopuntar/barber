import { GetAvailabilityPerSlotUseCase } from "./GetAvailabilityPerSlotUseCase";
import { GetAvailabilityUseCase } from "./GetAvailabilityUseCase";
import { IEmployeeRepository } from "../repositories/IEmployeeRepository";
import IServiceRepository from "../repositories/IServiceRepository";
import Employee from "../models/Employee";
import Service from "../models/Service";

describe("GetAvailabilityPerSlotUseCase", () => {
  let useCase: GetAvailabilityPerSlotUseCase;
  let employeeRepository: jest.Mocked<IEmployeeRepository>;
  let serviceRepository: jest.Mocked<IServiceRepository>;
  let getAvailabilityUseCase: jest.Mocked<GetAvailabilityUseCase>;

  beforeEach(() => {
    employeeRepository = {
      getEmployeesByBusinessId: jest.fn(),
      getEmployee: jest.fn(),
    } as any;
    serviceRepository = {
      getServiceById: jest.fn(),
      getServicesByBusinessId: jest.fn(),
    } as any;
    getAvailabilityUseCase = {
      getAvailability: jest.fn(),
      execute: jest.fn(),
    } as any;

    useCase = new GetAvailabilityPerSlotUseCase(
      employeeRepository,
      serviceRepository,
      getAvailabilityUseCase
    );
  });

  it("should return availability grouped by slots with multiple employees", async () => {
    // Arrange
    const businessId = "biz-123";
    const serviceId = "srv-789";
    const initialDate = new Date(2024, 2, 4); // Monday (March 4, 2024)
    const finalDate = new Date(2024, 2, 4);

    const emp1 = new Employee();
    emp1.id = "emp-1";
    emp1.name = "Employee 1";

    const emp2 = new Employee();
    emp2.id = "emp-2";
    emp2.name = "Employee 2";

    const service = new Service();
    service.id = serviceId;
    service.duration = 60;

    employeeRepository.getEmployeesByBusinessId.mockResolvedValue([emp1, emp2]);
    serviceRepository.getServiceById.mockResolvedValue(service);

    // Mock emp1 availability: 09:00-10:00, 10:00-11:00
    getAvailabilityUseCase.getAvailability.mockResolvedValueOnce([
      {
        date: initialDate,
        slots: [
          { start: "09:00", end: "10:00" },
          { start: "10:00", end: "11:00" },
        ],
      },
    ]);

    // Mock emp2 availability: 10:00-11:00, 11:00-12:00
    getAvailabilityUseCase.getAvailability.mockResolvedValueOnce([
      {
        date: initialDate,
        slots: [
          { start: "10:00", end: "11:00" },
          { start: "11:00", end: "12:00" },
        ],
      },
    ]);

    // Act
    const result = await useCase.execute({
      businessId,
      serviceId,
      initialDate,
      finalDate,
    });

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].date.toISOString().split("T")[0]).toEqual("2024-03-04");
    expect(result[0].slots).toHaveLength(3);

    // Slot 09:00-10:00: only emp1
    expect(result[0].slots[0]).toEqual({
      start: "09:00",
      end: "10:00",
      employees: [emp1],
    });

    // Slot 10:00-11:00: both emp1 and emp2
    expect(result[0].slots[1]).toEqual({
      start: "10:00",
      end: "11:00",
      employees: [emp1, emp2],
    });

    // Slot 11:00-12:00: only emp2
    expect(result[0].slots[2]).toEqual({
      start: "11:00",
      end: "12:00",
      employees: [emp2],
    });
  });

  it("should return empty results if no employees are found", async () => {
    // Arrange
    const businessId = "biz-123";
    const serviceId = "srv-789";
    const date = new Date(2024, 2, 4);

    employeeRepository.getEmployeesByBusinessId.mockResolvedValue([]);
    serviceRepository.getServiceById.mockResolvedValue(new Service());

    // Act
    const result = await useCase.execute({
      businessId,
      serviceId,
      initialDate: date,
      finalDate: date,
    });

    // Assert
    expect(result).toEqual([]);
  });

  it("should handle multiple days correctly", async () => {
    // Arrange
    const businessId = "biz-123";
    const serviceId = "srv-789";
    const initialDate = new Date(2024, 2, 4); // Monday
    const finalDate = new Date(2024, 2, 5); // Tuesday

    const emp1 = new Employee();
    emp1.id = "emp-1";

    const service = new Service();
    service.duration = 60;

    employeeRepository.getEmployeesByBusinessId.mockResolvedValue([emp1]);
    serviceRepository.getServiceById.mockResolvedValue(service);

    getAvailabilityUseCase.getAvailability.mockResolvedValueOnce([
      {
        date: initialDate,
        slots: [{ start: "09:00", end: "10:00" }],
      },
      {
        date: finalDate,
        slots: [{ start: "14:00", end: "15:00" }],
      },
    ]);

    // Act
    const result = await useCase.execute({
      businessId,
      serviceId,
      initialDate,
      finalDate,
    });

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].date.toISOString().split("T")[0]).toEqual("2024-03-04");
    expect(result[0].slots[0].start).toEqual("09:00");
    expect(result[1].date.toISOString().split("T")[0]).toEqual("2024-03-05");
    expect(result[1].slots[0].start).toEqual("14:00");
  });
});
