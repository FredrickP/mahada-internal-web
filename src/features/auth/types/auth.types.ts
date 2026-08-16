export type UserRole =
  | 'USER'
  | 'APPROVER'
  | 'PROCESSOR'
  | 'ADMIN';

export type Division =
  | 'IT'
  | 'HCGA'
  | 'FINANCE'
  | 'OPERATION'
  | 'SALES_MARKETING'
  | 'RISK_COMPLIANCE'
  | 'BOD';

export type ProcessorModule =
  | 'IT_REQUEST'
  | 'LEAVE'
  | 'BUSINESS_TRIP'
  | 'PAYMENT';

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;

  roles: UserRole[];

  division: Division;
  position?: string;

  processorModules?: ProcessorModule[];
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}