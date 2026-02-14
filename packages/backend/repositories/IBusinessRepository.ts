import Business from "../models/Business";

export interface IBusinessRepository {
  getBusinessById(businessId: string): Promise<Business | null>;
}
