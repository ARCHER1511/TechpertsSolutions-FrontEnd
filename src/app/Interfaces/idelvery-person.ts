export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export enum DeliveryPersonStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected'
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
  vehicleNumber?: string;
  vehicleType?: string;
  vehicleImage?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  isAvailable: boolean;
  accountStatus: DeliveryPersonStatus;
}

export interface Offer {
  clusterId: string;
  createdAt: string;
  customerName: string;
  deliveryId: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  deliveryPersonId: string;
  deliveryTrackingNumber: string;
  expiryTime: Date;
  id: string;
  isActive: boolean;
  status: string;
  techCompanies: any[]
}

export interface TechCompany {
  Rating: number;
  Description: string;
  RoleId: string;
  Role: string;
}