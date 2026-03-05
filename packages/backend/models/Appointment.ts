import Customer from "./Customer";
import Employee from "./Employee";
import Service from "./Service";

export default class Appointment {
  #id: string;
  #date: Date;
  #initialTime: string;
  #finalTime: string;
  #employee: Employee | undefined;
  #service: Service | undefined;
  #customer: Customer | undefined;
  #createdAt: Date;
  #updatedAt: Date;

  constructor({ id, date, initialTime, finalTime, employee, service, customer, createdAt, updatedAt }: {
    id: string;
    date: Date;
    initialTime: string;
    finalTime: string;
    employee?: Employee;
    service?: Service;
    customer?: Customer;
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

  conflictsWith(start: string, end: string): boolean {
    return start < this.#finalTime && end > this.#initialTime;
  }
}
