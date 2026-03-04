import Customer from "./Customer";
import Employee from "./Employee";
import Service from "./Service";

export default class Appointment {
  id: string;
  date: Date;
  initialTime: string;
  finalTime: string;
  employee: Employee;
  service: Service;
  customer: Customer;
  createdAt: Date;
  updatedAt: Date;
}
