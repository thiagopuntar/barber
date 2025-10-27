import Employee from "../models/Employee";

export interface IEmployeeRepository {
    getEmployeesByBusinessId(businessId: string): Promise<Employee[]>;
}