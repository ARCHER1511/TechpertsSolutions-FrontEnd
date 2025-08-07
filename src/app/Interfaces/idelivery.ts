export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export enum DeliveryStatus {
  Pending = 'Pending',
  InTransit = 'InTransit',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export interface DeliveryCreateDTO {
  trackingNumber?: string;
  deliveryAddress?: string;
  customerPhone?: string;
  customerName?: string;
  estimatedDeliveryDate?: string; // Use ISO string for dates
  notes?: string;
  deliveryFee?: number;
  deliveryPersonId?: string;
  customerId?: string;
}

export interface DeliveryUpdateDTO {
  trackingNumber?: string;
  deliveryAddress?: string;
  customerPhone?: string;
  customerName?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  deliveryStatus?: string;
  notes?: string;
  deliveryFee?: number;
  deliveryPersonId?: string;
}

export interface DeliveryDetails {
  id: string;
  trackingNumber: string;
  deliveryAddress: string;
  customerPhone: string;
  customerName: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  deliveryStatus: string;
  notes?: string;
  deliveryFee: number;
  deliveryPersonId: string;
  customerId: string;
}
