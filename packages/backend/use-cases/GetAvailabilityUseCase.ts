import { IEmployeeRepository } from "../repositories/IEmployeeRepository";
import IServiceRepository from "../repositories/IServiceRepository";
import IAppointmentRepository from "../repositories/IAppointmentRepository";
import Appointment from "../models/Appointment";
import Employee from "../models/Employee";
import { Logger } from "../utils/Logger";

export class GetAvailabilityUseCase {
  constructor(
    private employeeRepository: IEmployeeRepository,
    private serviceRepository: IServiceRepository,
    private appointmentRepository: IAppointmentRepository
  ) { }

  async execute(input: {
    businessId: string;
    serviceId: string;
    employeeId: string;
    initialDate: Date;
    finalDate: Date;
  }): Promise<SlotPerDay[]> {
    const { businessId, serviceId, employeeId, initialDate, finalDate } = input;
    const employee = await this.employeeRepository.getById(businessId, employeeId);
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
      const appointments = await this.appointmentRepository.getAllByEmployeeIdAndDate(
        businessId,
        employee.id,
        currentDate
      );
      const slots = this.getSlotPerDay({ date: currentDate, duration, employee, appointments });
      freeSlots.push(...slots);
      dateCopy.setDate(dateCopy.getDate() + 1);
    }

    return freeSlots;
  }

  getSlotPerDay(input: { date: Date, duration: number, employee: Employee, appointments: Appointment[] }): SlotPerDay[] {
    const { date, duration, employee, appointments } = input;
    const day = date.getDay();
    const availability = employee.getAvailabilityForWeekDay(day);

    Logger.debug(`Availability for day ${day} and employee ${employee.id}: ${JSON.stringify(availability)}`);
    if (!availability) {
      Logger.debug(`No availability for day ${day}, and employee ${employee.id}`);
      return [];
    }

    // Break down each range into slots based on duration
    const slots: Array<{ start: string; end: string }> = [];
    for (const range of availability.range) {
      const rangeSlots = this.#generateSlotsFromRange(range, duration, appointments);
      slots.push(...rangeSlots);
    }

    Logger.debug(`Slots for day ${day} and employee ${employee.id}: ${JSON.stringify(slots)}`);

    return [
      {
        date: date,
        slots: slots,
      },
    ];
  }

  #generateSlotsFromRange(
    range: { start: string; end: string },
    duration: number,
    appointments: Appointment[]
  ): Array<{ start: string; end: string }> {
    const slots: Array<{ start: string; end: string }> = [];
    const [startHour, startMinute] = range.start.split(":").map(Number);
    const [endHour, endMinute] = range.end.split(":").map(Number);

    // Convert to minutes
    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    while (currentMinutes + duration <= endMinutes) {
      const slotStartHour = Math.floor(currentMinutes / 60);
      const slotStartMinute = currentMinutes % 60;

      const nextMinutes = currentMinutes + duration;
      const slotEndHour = Math.floor(nextMinutes / 60);
      const slotEndMinute = nextMinutes % 60;

      const start = `${String(slotStartHour).padStart(2, "0")}:${String(slotStartMinute).padStart(2, "0")}`;
      const end = `${String(slotEndHour).padStart(2, "0")}:${String(slotEndMinute).padStart(2, "0")}`;

      const hasConflict = appointments.some(appointment => {
        return appointment.conflictsWith(range.start, range.end);
      });

      if (!hasConflict) {
        slots.push({ start, end });
      }

      currentMinutes = nextMinutes;
    }

    return slots;
  }
}

export type SlotPerDay = {
  date: Date;
  slots: Array<{
    start: string;
    end: string;
  }>;
}