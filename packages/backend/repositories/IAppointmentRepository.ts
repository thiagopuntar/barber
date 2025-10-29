import Appointment from "../models/Appointment";

interface IAppointmentRepository {
    getAppointmentsByEmployeeIdAndDate(businessId: string, employeeId: string, date: Date): Promise<Appointment[]>;
}

export default IAppointmentRepository;