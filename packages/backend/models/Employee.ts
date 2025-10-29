import Appointment from "./Appointment";

type Availability = {
  weekDay: number;
  range: Array<{
    start: string;
    end: string;
  }>;
};

export type SlotPerDay = {
  date: Date;
  slots: Array<{
    start: string;
    end: string;
  }>;
};

class Employee {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  availability: Availability[] = [];
  private appointments: Appointment[] = [];

  addAppointments(appointments: Appointment[]): void {
    this.appointments = [...this.appointments, ...appointments];
  }

  getSlotPerDay(date: Date, duration: number): SlotPerDay[] {
    const day = date.getDay();
    if (!this.availability) {
      return [];
    }
    const availability = this.availability.find(availability => availability.weekDay === day);
    if (!availability) {
      return [];
    }

    // Break down each range into slots based on duration
    const slots: Array<{ start: string; end: string }> = [];
    for (const range of availability.range) {
      const rangeSlots = this.generateSlotsFromRange(range.start, range.end, duration);
      slots.push(...rangeSlots);
    }

    // Filter out slots that conflict with existing appointments
    const availableSlots = slots.filter(slot => {
      return !this.hasAppointmentConflict(date, slot.start, slot.end);
    });

    return [
      {
        date: date,
        slots: availableSlots,
      },
    ];
  }

  private generateSlotsFromRange(
    startTime: string,
    endTime: string,
    duration: number
  ): Array<{ start: string; end: string }> {
    const slots: Array<{ start: string; end: string }> = [];
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

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

      slots.push({ start, end });
      currentMinutes = nextMinutes;
    }

    return slots;
  }

  private hasAppointmentConflict(date: Date, slotStart: string, slotEnd: string): boolean {
    if (!this.appointments || this.appointments.length === 0) {
      return false;
    }

    // Normalize the date to compare only year, month, and day
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return this.appointments.some(appointment => {
      const appointmentDate = new Date(
        appointment.date.getFullYear(),
        appointment.date.getMonth(),
        appointment.date.getDate()
      );

      // Check if appointment is on the same date
      if (appointmentDate.getTime() !== dateOnly.getTime()) {
        return false;
      }

      // Check if times overlap
      // Two time ranges overlap if: slotStart < appointment.finalTime AND slotEnd > appointment.initialTime
      return slotStart < appointment.finalTime && slotEnd > appointment.initialTime;
    });
  }
}

export default Employee;
