import { IEmployeeRepository } from "../repositories/IEmployeeRepository";
import IServiceRepository from "../repositories/IServiceRepository";
import { Logger } from "../utils/Logger";

export default class CreateAvailabilityUseCase {

    constructor(
        private readonly employeeRepository: IEmployeeRepository,
        private readonly serviceRepository: IServiceRepository
    ) {

    }

    async execute({ businessId, employeeId, serviceId, date, initialTime, finalTime }:
        {
            businessId: string,
            employeeId: string,
            serviceId: string,
            date: Date,
            initialTime: string,
            finalTime: string
        }) {
        const employee = await this.employeeRepository.getById(businessId, employeeId);
        if (!employee) {
            Logger.error(`Employee not found for business ${businessId} and employee ${employeeId}`);
            throw new Error("Employee not found");
        }

        const service = await this.serviceRepository.getById(businessId, serviceId);
        if (!service) {
            Logger.error(`Service not found for business ${businessId} and service ${serviceId}`);
            throw new Error("Service not found");
        }

    }
}