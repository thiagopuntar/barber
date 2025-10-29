import Appointment from "./Appointment";

type Availability = {
    weekDay: number;
    range: Array<{
        start: string;
        end: string;
    }>
}

type SlotPerDay = {
    date: Date;
    slots: Array<{
        start: string;
        end: string;
    }>
}

class Employee {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    availability: Availability[] = [];
    private appointments: Appointment[];

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

        return [{
            date: date,
            slots: slots
        }];
    }

    private generateSlotsFromRange(startTime: string, endTime: string, duration: number): Array<{ start: string; end: string }> {
        const slots: Array<{ start: string; end: string }> = [];
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        // Convert to minutes
        let currentMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        
        while (currentMinutes + duration <= endMinutes) {
            const slotStartHour = Math.floor(currentMinutes / 60);
            const slotStartMinute = currentMinutes % 60;
            
            const nextMinutes = currentMinutes + duration;
            const slotEndHour = Math.floor(nextMinutes / 60);
            const slotEndMinute = nextMinutes % 60;
            
            const start = `${String(slotStartHour).padStart(2, '0')}:${String(slotStartMinute).padStart(2, '0')}`;
            const end = `${String(slotEndHour).padStart(2, '0')}:${String(slotEndMinute).padStart(2, '0')}`;
            
            slots.push({ start, end });
            currentMinutes = nextMinutes;
        }
        
        return slots;
    }
}

export default Employee;