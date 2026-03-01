import { IEmployeeRepository } from "../repositories/IEmployeeRepository";
import IServiceRepository from "../repositories/IServiceRepository";
import IAppointmentRepository from "../repositories/IAppointmentRepository";
import Employee, { SlotPerDay } from "../models/Employee";

export class GetAvailabilityUseCase {
  constructor(
    private employeeRepository: IEmployeeRepository,
    private serviceRepository: IServiceRepository,
    private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(input: {
    businessId: string;
    serviceId: string;
    employeeId: string;
    initialDate: Date;
    finalDate: Date;
  }): Promise<SlotPerDay[]> {
    const { businessId, serviceId, employeeId, initialDate, finalDate } = input;
    const employee = await this.employeeRepository.getEmployee(businessId, employeeId);
    const service = await this.serviceRepository.getServiceById(businessId, serviceId);

    return this.getAvailability({
      businessId,
      employee,
      duration: service.duration,
      initialDate,
      finalDate,
    });
  }

  async getAvailability(input: {
    businessId: string;
    employee: Employee;
    duration: number;
    initialDate: Date;
    finalDate: Date;
  }): Promise<SlotPerDay[]> {
    const { businessId, employee, duration, initialDate, finalDate } = input;
    const freeSlots: SlotPerDay[] = [];

    const dateCopy = new Date(initialDate);
    while (dateCopy <= finalDate) {
      const currentDate = new Date(dateCopy);
      const appointments = await this.appointmentRepository.getAppointmentsByEmployeeIdAndDate(
        businessId,
        employee.id,
        currentDate
      );
      employee.addAppointments(appointments);
      const slots = employee.getSlotPerDay(currentDate, duration);
      freeSlots.push(...slots);
      dateCopy.setDate(dateCopy.getDate() + 1);
    }

    return freeSlots;
  }
}
