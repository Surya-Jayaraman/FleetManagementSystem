/* export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  status: 'Active' | 'Inactive' | 'OnLeave';
  vehicleId?: string;
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
} */
export interface Driver {
  id: string;
  driverID: string;
  name: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  status: DriverStatus;
   vehicleId?: string;
  dateOfBirth?: string | Date | null;
  hireDate: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
export type DriverStatus = 'Active' | 'Inactive' | 'OnLeave';

export interface CreateDriverRequest {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  status: string;
  hireDate: Date;
}

export interface UpdateDriverRequest {
  firstName?: string;
  lastName?: string;
  licenseNumber?: string;
  phoneNumber?: string;
  email?: string;
  status?: string;
}

export interface AssignVehicleRequest {
  vehicleId: string;
}
