type GenericObject = {
  id: string;
  name: string;
};

export default class Appointment {
  #id: string;
  #date: Date;
  #initialTime: string;
  #finalTime: string;
  #employee: GenericObject;
  #service: GenericObject;
  #customer: GenericObject;
  #createdAt: Date;
  #updatedAt: Date;

  constructor({
    id,
    date,
    initialTime,
    finalTime,
    employee,
    service,
    customer,
    createdAt,
    updatedAt,
  }: {
    id: string;
    date: Date;
    initialTime: string;
    finalTime: string;
    employee: GenericObject;
    service: GenericObject;
    customer: GenericObject;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.#id = id;
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

  get id(): string {
    return this.#id;
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

  get service(): GenericObject {
    return this.#service;
  }

  get customer(): GenericObject {
    return this.#customer;
  }

  conflictsWith(start: string, end: string): boolean {
    return start < this.#finalTime && end > this.#initialTime;
  }
}
