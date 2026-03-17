import Business from "../../models/Business";

export interface IBusinessRepository {
  getById(businessId: string): Promise<Business | null>;
  getAll(): Promise<Business[]>;
}
