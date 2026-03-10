type GenericObject = {
  id: string;
  name: string;
};

type AppointmentService = {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
};

export default class Appointment {
  #date: Date;
  #initialTime: string;
  #finalTime: string;
  #employee: GenericObject;
  #service: AppointmentService;
  #customer: GenericObject;
  #createdAt: Date;
  #updatedAt: Date;

  constructor({
    date,
    initialTime,
    finalTime,
    employee,
    service,
    customer,
    createdAt,
    updatedAt,
  }: {
    date: Date;
    initialTime: string;
    finalTime: string;
    employee: GenericObject;
    service: {
      id: string;
      name: string;
      duration: number;
      price: number;
      description: string;
    };
    customer: GenericObject;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.#date = date;
    this.#initialTime = initialTime;
    this.#finalTime = finalTime;
    this.#employee = employee;
    this.#service = service;
    this.#customer = customer;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  get date(): Date {
    return this.#date;
  }

  get initialTime(): string {
    return this.#initialTime;
  }

  get finalTime(): string {
    return this.#finalTime;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  get employee(): GenericObject {
    return this.#employee;
  }

  get service(): AppointmentService {
    return this.#service;
  }

  get customer(): GenericObject {
    return this.#customer;
  }

  toJSON(): any {
    return {
      date: this.#date,
      initialTime: this.#initialTime,
      finalTime: this.#finalTime,
      employee: this.#employee,
      service: this.#service,
      customer: this.#customer,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
  }

  conflictsWith(start: string, end: string): boolean {
    return start < this.#finalTime && end > this.#initialTime;
  }
}
