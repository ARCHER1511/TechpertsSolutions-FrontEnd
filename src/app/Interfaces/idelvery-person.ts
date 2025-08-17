export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export enum DeliveryPersonStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2
}

export interface DeliveryPersonUpdateDTO {
  vehicleNumber?: string;
  vehicleType?: string;
  vehicleImage?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  isAvailable?: boolean;
  accountStatus: DeliveryPersonStatus;
}

export interface DeliveryPerson {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city?: string;
  country?: string;
  isAvailable: boolean;
  vehicleNumber?: string;
  vehicleType?: string;
  vehicleImage?: string;
  accountStatus: DeliveryPersonStatus;
}

export interface Offer {
  id: string;
  orderId: string;
  driverId: string;
  status: string;
  createdAt: string;
}
