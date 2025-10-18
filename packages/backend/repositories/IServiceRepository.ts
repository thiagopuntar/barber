import Service from "../models/Service";

interface IServiceRepository {
    getServicesByBusinessId(businessId: string): Promise<Service[]>;
}

export default IServiceRepository;