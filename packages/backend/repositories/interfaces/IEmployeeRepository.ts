import Employee from "../../models/Employee";

export interface IEmployeeRepository {
  getAllByBusinessId(businessId: string): Promise<Employee[]>;
  getById(businessId: string, employeeId: string): Promise<Employee | null>;
}
