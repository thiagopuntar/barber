import Appointment from "./Appointment";

class Employee {
  #id: string;
  #name: string;
  #createdAt: Date;
  #updatedAt: Date;
  #availability: Availability[] = [];

  constructor({
    id,
    name,
    createdAt,
    updatedAt,
  }: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.#id = id;
    this.#name = name;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  addAvailability(...availability: Availability[]): void {
    this.#availability = [...this.#availability, ...availability];
  }

  getAvailabilityForWeekDay(weekDay: number): Availability | undefined {
    return this.#availability.find(availability => availability.weekDay === weekDay);
  }

  hasAvailabilityForSlot({
    date,
    initialTime,
    endTime,
  }: {
    date: Date;
    initialTime: string;
    endTime: string;
  }) {
    const availability = this.getAvailabilityForWeekDay(date.getDay());
    if (!availability) {
      return false;
    }

    return availability.range.some(range => {
      return range.start <= initialTime && range.end >= endTime;
    });
  }

  toJSON(): any {
    return {
      id: this.#id,
      name: this.#name,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
  }
}

export default Employee;

export type Availability = {
  weekDay: number;
  range: Array<{
    start: string;
    end: string;
  }>;
};
