import Service from "./Service";
import Employee from "./Employee";

class Business {
  #id: string;
  #name: string;
  #description: string;
  #image: string;
  #url: string;
  #address: string;
  #city: string;
  #state?: string;
  #zip?: string;
  #country?: string;
  #phone?: string;
  #email?: string;
  #createdAt: Date;
  #updatedAt: Date;
  #services: Service[];
  #employees: Employee[];

  constructor({
    id,
    name,
    description,
    image,
    url,
    address,
    city,
    state,
    zip,
    country,
    phone,
    email,
    createdAt,
    updatedAt,
  }: {
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
  }) {
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#image = image;
    this.#url = url;
    this.#address = address;
    this.#city = city;
    this.#state = state;
    this.#zip = zip;
    this.#country = country;
    this.#phone = phone;
    this.#email = email;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  toJSON(): BusinessJSON {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      image: this.#image,
      url: this.#url,
      address: this.#address,
      city: this.#city,
      state: this.#state,
      zip: this.#zip,
      country: this.#country,
      phone: this.#phone,
      email: this.#email,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
  }
}

export default Business;

type BusinessJSON = {
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
};
