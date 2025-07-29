
export interface IGeneralResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ICategory {
  id: string;
  name: string;

}

export interface ICategoryWithProducts {
  id: string;
  name: string;
  description: string;
  image: string | null;
  products: ICategoryProduct[];
  subCategories: any[];
}

export interface ICategoryProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  specifications?: any[]; // Add specifications field
}

export interface ICategoryCreate {
  name: string;
}

export interface ICategoryUpdate {
  id: string;
  name: string;
}
