import Service from "./Service";
import Employee from "./Employee";

class Business {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  address: string;
  city: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  services: Service[];
  employees: Employee[];
}

export default Business;
