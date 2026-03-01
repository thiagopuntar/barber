import { IEmployeeRepository } from "../repositories/IEmployeeRepository";
import IServiceRepository from "../repositories/IServiceRepository";
import IAppointmentRepository from "../repositories/IAppointmentRepository";
import { SlotPerDay } from "../models/Employee";

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

    const freeSlots: SlotPerDay[] = [];

    for (let date = new Date(initialDate); date <= finalDate; date.setDate(date.getDate() + 1)) {
      const currentDate = new Date(date);
      const appointments = await this.appointmentRepository.getAppointmentsByEmployeeIdAndDate(
        businessId,
        employeeId,
        currentDate
      );
      employee.addAppointments(appointments);
      const slots = employee.getSlotPerDay(currentDate, service.duration);
      freeSlots.push(...slots);
    }

    return freeSlots;
  }
}
