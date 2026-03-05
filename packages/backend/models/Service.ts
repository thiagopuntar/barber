class Service {
  #id: string;
  #name: string;
  #description: string;
  #price: number;
  #duration: number;
  #createdAt: Date;
  #updatedAt: Date;

  constructor({
    id,
    name,
    description,
    price,
    duration,
    createdAt,
    updatedAt,
  }: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#duration = duration;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get description(): string {
    return this.#description;
  }

  get price(): number {
    return this.#price;
  }

  get duration(): number {
    return this.#duration;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  toJSON(): any {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      price: this.#price,
      duration: this.#duration,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
  }
}

export default Service;
