import { IEmployeeRepository } from "../repositories/IEmployeeRepository";
import IServiceRepository from "../repositories/IServiceRepository";
import { SlotPerDayAndEmployee } from "../models/Employee";
import { GetAvailabilityUseCase } from "./GetAvailabilityUseCase";

export class GetAvailabilityPerSlotUseCase {
  constructor(
    private employeeRepository: IEmployeeRepository,
    private serviceRepository: IServiceRepository,
    private getAvailabilityUseCase: GetAvailabilityUseCase
  ) {}

  async execute(input: {
    businessId: string;
    serviceId: string;
    initialDate: Date;
    finalDate: Date;
  }): Promise<SlotPerDayAndEmployee[]> {
    const { businessId, serviceId, initialDate, finalDate } = input;
    const employees = await this.employeeRepository.getEmployeesByBusinessId(businessId);
    const service = await this.serviceRepository.getServiceById(businessId, serviceId);

    const result: SlotPerDayAndEmployee[] = [];
    const dateToSlotsMap: Map<string, Map<string, { start: string; end: string; employees: any[] }>> = new Map();

    for (const employee of employees) {
      const availability = await this.getAvailabilityUseCase.getAvailability({
        businessId,
        employee,
        duration: service.duration,
        initialDate,
        finalDate,
      });

      for (const daySlots of availability) {
        const dateKey = daySlots.date.toISOString().split("T")[0];
        if (!dateToSlotsMap.has(dateKey)) {
          dateToSlotsMap.set(dateKey, new Map());
        }
        const slotsForDay = dateToSlotsMap.get(dateKey)!;

        for (const slot of daySlots.slots) {
          const slotKey = `${slot.start}-${slot.end}`;
          if (!slotsForDay.has(slotKey)) {
            slotsForDay.set(slotKey, { ...slot, employees: [] });
          }
          slotsForDay.get(slotKey)!.employees.push(employee);
        }
      }
    }

    // Convert map to final response format
    for (const [dateStr, slotsMap] of dateToSlotsMap.entries()) {
      const sortedSlots = Array.from(slotsMap.values()).sort((a, b) => a.start.localeCompare(b.start));
      result.push({
        date: new Date(dateStr),
        slots: sortedSlots,
      });
    }

    // Sort result by date
    return result.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
