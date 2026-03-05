import Service from "../models/Service";

interface IServiceRepository {
  getAllByBusinessId(businessId: string): Promise<Service[]>;
  getById(businessId: string, serviceId: string): Promise<Service>;
}

export default IServiceRepository;
