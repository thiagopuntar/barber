import Appointment from "../models/Appointment";

interface IAppointmentRepository {
  getAllByEmployeeIdAndDate(
    businessId: string,
    employeeId: string,
    date: Date
  ): Promise<Appointment[]>;

  create(businessId: string, appointment: Appointment): Promise<Appointment>;
}

export default IAppointmentRepository;
