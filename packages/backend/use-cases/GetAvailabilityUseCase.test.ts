import { GetAvailabilityUseCase } from "./GetAvailabilityUseCase";
import { IEmployeeRepository } from "../repositories/IEmployeeRepository";
import IServiceRepository from "../repositories/IServiceRepository";
import IAppointmentRepository from "../repositories/IAppointmentRepository";
import Employee from "../models/Employee";
import Service from "../models/Service";
import Appointment from "../models/Appointment";

describe("GetAvailabilityUseCase", () => {
  let useCase: GetAvailabilityUseCase;
  let employeeRepository: jest.Mocked<IEmployeeRepository>;
  let serviceRepository: jest.Mocked<IServiceRepository>;
  let appointmentRepository: jest.Mocked<IAppointmentRepository>;

  beforeEach(() => {
    employeeRepository = {
      getEmployee: jest.fn(),
      getEmployeesByBusinessId: jest.fn(),
    } as any;
    serviceRepository = {
      getServiceById: jest.fn(),
      getServicesByBusinessId: jest.fn(),
    } as any;
    appointmentRepository = {
      getAppointmentsByEmployeeIdAndDate: jest.fn(),
    } as any;

    useCase = new GetAvailabilityUseCase(
      employeeRepository,
      serviceRepository,
      appointmentRepository
    );
  });

  it("should return availability for a single day", async () => {
    // Arrange
    const businessId = "biz-123";
    const employeeId = "emp-456";
    const serviceId = "srv-789";
    const initialDate = new Date(2024, 2, 4); // Monday (March 4, 2024)
    const finalDate = new Date(2024, 2, 4);

    const employee = new Employee();
    employee.id = employeeId;
    employee.availability = [
      {
        weekDay: 1, // Monday
        range: [{ start: "09:00", end: "10:00" }],
      },
    ];

    const service = new Service();
    service.id = serviceId;
    service.duration = 30;

    employeeRepository.getEmployee.mockResolvedValue(employee);
    serviceRepository.getServiceById.mockResolvedValue(service);
    appointmentRepository.getAppointmentsByEmployeeIdAndDate.mockResolvedValue([]);

    // Act
    const result = await useCase.execute({
      businessId,
      serviceId,
      employeeId,
      initialDate,
      finalDate,
    });

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].date).toEqual(initialDate);
    expect(result[0].slots).toEqual([
      { start: "09:00", end: "09:30" },
      { start: "09:30", end: "10:00" },
    ]);
    expect(employeeRepository.getEmployee).toHaveBeenCalledWith(businessId, employeeId);
    expect(serviceRepository.getServiceById).toHaveBeenCalledWith(businessId, serviceId);
    expect(appointmentRepository.getAppointmentsByEmployeeIdAndDate).toHaveBeenCalledWith(
      businessId,
      employeeId,
      initialDate
    );
  });

  it("should return availability for multiple days", async () => {
    // Arrange
    const businessId = "biz-123";
    const employeeId = "emp-456";
    const serviceId = "srv-789";
    const initialDate = new Date(2024, 2, 4); // Monday
    const finalDate = new Date(2024, 2, 5); // Tuesday

    const employee = new Employee();
    employee.id = employeeId;
    employee.availability = [
      {
        weekDay: 1, // Monday
        range: [{ start: "09:00", end: "10:00" }],
      },
      {
        weekDay: 2, // Tuesday
        range: [{ start: "14:00", end: "15:00" }],
      },
    ];

    const service = new Service();
    service.id = serviceId;
    service.duration = 60;

    employeeRepository.getEmployee.mockResolvedValue(employee);
    serviceRepository.getServiceById.mockResolvedValue(service);
    appointmentRepository.getAppointmentsByEmployeeIdAndDate.mockResolvedValue([]);

    // Act
    const result = await useCase.execute({
      businessId,
      serviceId,
      employeeId,
      initialDate,
      finalDate,
    });

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].date).toEqual(initialDate);
    expect(result[0].slots).toEqual([{ start: "09:00", end: "10:00" }]);
    expect(result[1].date).toEqual(finalDate);
    expect(result[1].slots).toEqual([{ start: "14:00", end: "15:00" }]);
  });

  it("should exclude slots with conflicting appointments", async () => {
    // Arrange
    const businessId = "biz-123";
    const employeeId = "emp-456";
    const serviceId = "srv-789";
    const date = new Date(2024, 2, 4); // Monday

    const employee = new Employee();
    employee.id = employeeId;
    employee.availability = [
      {
        weekDay: 1,
        range: [{ start: "09:00", end: "11:00" }],
      },
    ];

    const service = new Service();
    service.id = serviceId;
    service.duration = 60;

    const appointment = new Appointment();
    appointment.date = date;
    appointment.initialTime = "09:00";
    appointment.finalTime = "10:00";

    employeeRepository.getEmployee.mockResolvedValue(employee);
    serviceRepository.getServiceById.mockResolvedValue(service);
    appointmentRepository.getAppointmentsByEmployeeIdAndDate.mockResolvedValue([appointment]);

    // Act
    const result = await useCase.execute({
      businessId,
      serviceId,
      employeeId,
      initialDate: date,
      finalDate: date,
    });

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].slots).toEqual([{ start: "10:00", end: "11:00" }]);
  });

  it("should return empty array if no availability for the given date", async () => {
    // Arrange
    const businessId = "biz-123";
    const employeeId = "emp-456";
    const serviceId = "srv-789";
    const date = new Date(2024, 2, 3); // Sunday

    const employee = new Employee();
    employee.id = employeeId;
    employee.availability = [
      {
        weekDay: 1, // Monday
        range: [{ start: "09:00", end: "11:00" }],
      },
    ];

    const service = new Service();
    service.id = serviceId;
    service.duration = 60;

    employeeRepository.getEmployee.mockResolvedValue(employee);
    serviceRepository.getServiceById.mockResolvedValue(service);
    appointmentRepository.getAppointmentsByEmployeeIdAndDate.mockResolvedValue([]);

    // Act
    const result = await useCase.execute({
      businessId,
      serviceId,
      employeeId,
      initialDate: date,
      finalDate: date,
    });

    // Assert
    expect(result).toHaveLength(0);
  });
});
