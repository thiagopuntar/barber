import KnownError from "../errors/KnownError";
import Appointment from "../models/Appointment";
import IAppointmentRepository from "../repositories/interfaces/IAppointmentRepository";
import { IEmployeeRepository } from "../repositories/interfaces/IEmployeeRepository";
import IServiceRepository from "../repositories/interfaces/IServiceRepository";
import { Logger } from "../utils/Logger";
import { GetAvailabilityUseCase } from "./GetAvailabilityUseCase";

export default class CreateAvailabilityUseCase {
  constructor(
    private readonly employeeRepository: IEmployeeRepository,
    private readonly serviceRepository: IServiceRepository,
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute({
    businessId,
    employeeId,
    serviceId,
    date,
    initialTime,
    customerData,
  }: {
    businessId: string;
    employeeId: string;
    serviceId: string;
    date: Date;
    initialTime: string;
    customerData: {
      id: string;
      name: string;
    };
  }) {
    const employee = await this.employeeRepository.getById(businessId, employeeId);
    if (!employee) {
      Logger.error(
        `Employee not found for business ${businessId} and employee ${employeeId}`
      );
      throw new KnownError("Employee not found");
    }
    Logger.debug("employee", employee);

    const service = await this.serviceRepository.getById(businessId, serviceId);
    if (!service) {
      Logger.error(
        `Service not found for business ${businessId} and service ${serviceId}`
      );
      throw new KnownError("Service not found");
    }
    Logger.debug("service", service);

    const [startHour, startMinute] = initialTime.split(":").map(Number);
    const totalMinutes = startHour * 60 + startMinute + service.duration;
    const finalHour = Math.floor(totalMinutes / 60);
    const finalMinute = totalMinutes % 60;
    const finalTime = `${String(finalHour).padStart(2, "0")}:${String(
      finalMinute
    ).padStart(2, "0")}`;

    // Create the availability
    const hasAvailability = employee.hasAvailabilityForSlot({
      date,
      initialTime,
      endTime: finalTime,
    });
    if (!hasAvailability) {
      Logger.error(
        `No availability found for business ${businessId} and employee ${employeeId} and service ${serviceId} and date ${date}`
      );
      throw new KnownError("No availability found");
    }

    const appointments = await this.appointmentRepository.getAllByEmployeeIdAndDate(
      businessId,
      employeeId,
      date
    );

    const hasConflicts = appointments.some(appointment => {
      return appointment.conflictsWith(initialTime, finalTime);
    });
    if (hasConflicts) {
      Logger.error(
        `Conflicts found for business ${businessId} and employee ${employeeId} and service ${serviceId} and date ${date} and initialTime ${initialTime} and finalTime ${finalTime}`
      );
      throw new KnownError("Conflicts found");
    }

    const appointment = new Appointment({
      date,
      initialTime,
      finalTime,
      employee: {
        id: employeeId,
        name: employee.name,
      },
      service: {
        id: serviceId,
        name: service.name,
        duration: service.duration,
        price: service.price,
        description: service.description,
      },
      customer: customerData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    Logger.debug("appointment", appointment);
    await this.appointmentRepository.create(businessId, appointment);

    return appointment;
  }
}
