import CreateAvailabilityUseCase from "./CreateAvailabilityUseCase";
import { IEmployeeRepository } from "../repositories/interfaces/IEmployeeRepository";
import IServiceRepository from "../repositories/interfaces/IServiceRepository";
import IAppointmentRepository from "../repositories/interfaces/IAppointmentRepository";
import Employee from "../models/Employee";
import Service from "../models/Service";
import Appointment from "../models/Appointment";

jest.mock("../utils/Logger");

describe("CreateAvailabilityUseCase", () => {
  let useCase: CreateAvailabilityUseCase;
  let employeeRepository: jest.Mocked<IEmployeeRepository>;
  let serviceRepository: jest.Mocked<IServiceRepository>;
  let appointmentRepository: jest.Mocked<IAppointmentRepository>;

  const businessId = "biz-123";
  const employeeId = "emp-456";
  const serviceId = "srv-789";
  const date = new Date(2024, 2, 4); // Monday (March 4, 2024)
  const initialTime = "09:00";
  const finalTime = "09:30";
  const customerData = {
    id: "cust-123",
    name: "John Customer",
  };

  beforeEach(() => {
    employeeRepository = {
      getById: jest.fn(),
    } as any;
    serviceRepository = {
      getById: jest.fn(),
    } as any;
    appointmentRepository = {
      getAllByEmployeeIdAndDate: jest.fn(),
      create: jest.fn(),
    } as any;

    useCase = new CreateAvailabilityUseCase(
      employeeRepository,
      serviceRepository,
      appointmentRepository
    );
  });

  it("should successfully create an appointment", async () => {
    // Arrange
    const employee = new Employee({
      id: employeeId,
      name: "John Doe",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    employee.addAvailability({
      weekDay: 1, // Monday
      range: [{ start: "09:00", end: "10:00" }],
    });

    const service = new Service({
      id: serviceId,
      name: "Test Service",
      description: "Test Description",
      price: 100,
      duration: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    employeeRepository.getById.mockResolvedValue(employee);
    serviceRepository.getById.mockResolvedValue(service);
    appointmentRepository.getAllByEmployeeIdAndDate.mockResolvedValue([]);
    appointmentRepository.create.mockResolvedValue(undefined as any);

    // Act
    const result = await useCase.execute({
      businessId,
      employeeId,
      serviceId,
      date,
      initialTime,
      customerData,
    });

    // Assert
    expect(result).toBeInstanceOf(Appointment);
    expect(result.date).toEqual(date);
    expect(result.initialTime).toBe(initialTime);
    expect(result.finalTime).toBe(finalTime);
    expect(result.employee.id).toBe(employeeId);
    expect(result.service.id).toBe(serviceId);
    expect(result.customer).toEqual(customerData);

    expect(employeeRepository.getById).toHaveBeenCalledWith(businessId, employeeId);
    expect(serviceRepository.getById).toHaveBeenCalledWith(businessId, serviceId);
    expect(appointmentRepository.getAllByEmployeeIdAndDate).toHaveBeenCalledWith(
      businessId,
      employeeId,
      date
    );
    expect(appointmentRepository.create).toHaveBeenCalledWith(
      businessId,
      expect.any(Appointment)
    );
  });

  it("should throw an error if employee is not found", async () => {
    // Arrange
    employeeRepository.getById.mockResolvedValue(null as any);

    // Act & Assert
    await expect(
      useCase.execute({
        businessId,
        employeeId,
        serviceId,
        date,
        initialTime,
        customerData,
      })
    ).rejects.toThrow("Employee not found");
  });

  it("should throw an error if service is not found", async () => {
    // Arrange
    const employee = new Employee({
      id: employeeId,
      name: "John Doe",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    employeeRepository.getById.mockResolvedValue(employee);
    serviceRepository.getById.mockResolvedValue(null as any);

    // Act & Assert
    await expect(
      useCase.execute({
        businessId,
        employeeId,
        serviceId,
        date,
        initialTime,
        customerData,
      })
    ).rejects.toThrow("Service not found");
  });

  it("should throw an error if employee has no availability for the slot", async () => {
    // Arrange
    const employee = new Employee({
      id: employeeId,
      name: "John Doe",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // No availability added

    const service = new Service({
      id: serviceId,
      name: "Test Service",
      description: "Test Description",
      price: 100,
      duration: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    employeeRepository.getById.mockResolvedValue(employee);
    serviceRepository.getById.mockResolvedValue(service);

    // Act & Assert
    await expect(
      useCase.execute({
        businessId,
        employeeId,
        serviceId,
        date,
        initialTime,
        customerData,
      })
    ).rejects.toThrow("No availability found");
  });

  it("should throw an error if there are conflicting appointments", async () => {
    // Arrange
    const employee = new Employee({
      id: employeeId,
      name: "John Doe",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    employee.addAvailability({
      weekDay: 1, // Monday
      range: [{ start: "09:00", end: "10:00" }],
    });

    const service = new Service({
      id: serviceId,
      name: "Test Service",
      description: "Test Description",
      price: 100,
      duration: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const conflictingAppointment = new Appointment({
      date,
      initialTime: "09:15",
      finalTime: "09:45",
      employee: { id: employeeId, name: "John Doe" },
      service: {
        id: "other-srv",
        name: "Other Service",
        duration: 30,
        price: 80,
        description: "Other service description",
      },
      customer: { id: "other-cust", name: "Other Customer" },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    employeeRepository.getById.mockResolvedValue(employee);
    serviceRepository.getById.mockResolvedValue(service);
    appointmentRepository.getAllByEmployeeIdAndDate.mockResolvedValue([
      conflictingAppointment,
    ]);

    // Act & Assert
    await expect(
      useCase.execute({
        businessId,
        employeeId,
        serviceId,
        date,
        initialTime,
        customerData,
      })
    ).rejects.toThrow("Conflicts found");
  });
});
