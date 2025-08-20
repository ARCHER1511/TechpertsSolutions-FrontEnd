export enum MaintenanceStatus {
  Requested = 0,
  Accepted = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
  Rejected = 5
}

export interface GeneralResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Maintenance {
  id: string;
  customerName: string;
  techCompanyName?: string;
  techCompanyImage?: string;
  productName?: string;
  serviceType?: string;
  warrantyStart?: Date;
  warrantyEnd?: Date;
}
export interface MaintenanceDetails {
  id: string;
  Customer: MaintenanceCustomer;
  techCompany: MaintenanceCustomer;
  Warranty: MaintenanceWarranty;
  Product: MaintenacnceProduct
  serviceUsage: MaintenanceServiceUsage
}

export interface MaintenanceCustomer {
    id: string;
    FullName?: string;
}

export interface MaintenanceWarranty {
    id: string;
    StartDate: Date;
    EndDate: Date;
    Description?: string;
    ProductName?: string;
}

export interface MaintenacnceProduct {
    id: string;
    Name?: string;
    Price?: number;
}
export interface MaintenanceServiceUsage {
    id: string;
    serviceType: string;
    UsedOn: Date;
    callCount: number;
}

export interface MaintenanceCreateDTO {
  customerId: string;
  techCompanyId?: string;
  warrantyId?: string;
  status?: MaintenanceStatus;
  notes?: string;
  deviceType: string;
  priority: string;
  issue: string;
  deviceImages: string[];
}

export interface MaintenanceUpdateDTO {
  customerId?: string;
  techCompanyId?: string;
  warrantyId?: string;
  status?: MaintenanceStatus;
  notes?: string;
  completedDate?: Date;
}

export interface CompleteMaintenanceRequest {
  techCompanyId: string;
  notes: string;
}

export interface MaintenanceNearest {
    id: string;
    Name: string;
    Address: string;
    TechCompanyName: string;
    TechCompanyAddress: string;
    TechCompanyPhone: string;
    Distence: number;
}
