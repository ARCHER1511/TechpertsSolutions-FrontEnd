export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export enum DeliveryClusterStatus {
  Pending = 0,
  Assigned = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4
}

export enum DeliveryOfferStatus {
  Pending = 0,
  Accepted = 1,
  Declined = 2,
  Canceled = 3,
  Expired = 4
}

export interface DeliveryOfferDTO {
  id: string;
  deliveryId: string;
  clusterId: string;
  deliveryPersonId: string;
  status: DeliveryOfferStatus;
  createdAt?: string;
  expiryTime?: string;
  isActive: boolean;

  // Optional related info
  deliveryTrackingNumber?: string;
  customerName?: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
}

export interface DeliveryClusterTrackingDTO {
  clusterId: string;
  deliveryId: string;

  techCompanyId: string;
  techCompanyName: string;

  distanceKm: number;
  price: number;

  assignedDriverId: string;
  driverName: string;
  assignmentTime?: string;

  dropoffLatitude?: number;
  dropoffLongitude?: number;

  sequenceOrder: number;

  estimatedDistance: number;
  estimatedPrice: number;

  status: DeliveryClusterStatus;
  location: string;
  lastUpdated: string;

  pickupConfirmed: boolean;
  pickupConfirmedAt?: string;
}

export interface DeliveryClusterDTO {
  id: string;
  deliveryId: string;
  techCompanyId: string;
  techCompanyName: string;

  distanceKm: number;
  price: number;
  status: DeliveryClusterStatus;

  assignedDriverId?: string;
  assignedDriverName?: string;
  assignmentTime?: string;

  retryCount: number;
  lastRetryTime?: string;

  dropoffLatitude?: number;
  dropoffLongitude?: number;
  pickupLatitude?: number;
  pickupLongitude?: number;

  sequenceOrder: number;
  driverOfferCount: number;

  latitude?: number;
  longitude?: number;
  estimatedDistance?: number;
  estimatedPrice?: number;

  tracking?: DeliveryClusterTrackingDTO;
  offers?: DeliveryOfferDTO[];
}

export interface DeliveryClusterCreateDTO {
  deliveryId: string;
  techCompanyId: string;
  techCompanyName: string;

  distanceKm: number;
  price: number;

  assignedDriverId?: string;

  dropoffLatitude?: number;
  dropoffLongitude?: number;

  pickupLatitude?: number;
  pickupLongitude?: number;

  pickupConfirmed?: boolean;
  pickupConfirmedAt?: string;

  sequenceOrder: number;
  tracking?: DeliveryClusterTrackingDTO;
}
