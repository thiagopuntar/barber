import Service from "../models/Service";

interface IServiceRepository {
  getServicesByBusinessId(businessId: string): Promise<Service[]>;
  getServiceById(businessId: string, serviceId: string): Promise<Service>;
}

export default IServiceRepository;
