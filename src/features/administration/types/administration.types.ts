export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE';

export type UserRole =
  | 'USER'
  | 'APPROVER'
  | 'PROCESSOR'
  | 'ADMIN';

export type AdministrationMenu =
  | 'USER_ROLE'
  | 'ORGANIZATION'
  | 'LEAVE_BALANCE'
  | 'TAX_CONFIGURATION';

export interface AdministrationSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRoles: number;
  totalApprovers: number;
  totalDivisions: number;
  totalLeaveBalances: number;
  totalTaxConfigurations: number;
}

export interface AdministrationUser {
  id: string;
  name: string;
  email: string;
  division: string;
  position: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
}

export interface AdministrationRole {
  id: string;
  name: UserRole;
  displayName: string;
  description: string;
  totalUsers: number;
}

export interface AdministrationMenuItem {
  id: AdministrationMenu;
  shortLabel: string;
  title: string;
  description: string;
  path: string;
}

export interface AdministrationData {
  summary: AdministrationSummary;
  recentUsers: AdministrationUser[];
  roles: AdministrationRole[];
  menus: AdministrationMenuItem[];
}

export interface CreateUserInput {
  name: string;
  email: string;
  division: string;
  position: string;
  role: UserRole;
}

export interface UpdateUserInput {
  name: string;
  email: string;
  division: string;
  position: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserMutationResponse {
  id: string;
  message: string;
}

export interface UpdateRoleInput {
  role: UserRole;
  description: string;
}

export type PermissionKey =
  | 'CREATE_SUBMISSION'
  | 'VIEW_OWN_SUBMISSION'
  | 'APPROVE_REJECT'
  | 'PROCESS_SUBMISSION'
  | 'VIEW_REPORT'
  | 'EXPORT_REPORT'
  | 'MANAGE_USER_ROLE'
  | 'MANAGE_ORGANIZATION'
  | 'MANAGE_LEAVE_BALANCE'
  | 'MANAGE_TAX_CONFIGURATION';

export interface AdministrationPermission {
  key: PermissionKey;
  label: string;
  description: string;
  enabled: boolean;
}

export interface RolePermissionDetail {
  role: UserRole;
  displayName: string;
  description: string;
  totalUsers: number;
  permissions: AdministrationPermission[];
}

export interface UpdateRolePermissionInput {
  role: UserRole;
  permissions: PermissionKey[];
}

export interface UpdateRolePermissionResponse {
  role: UserRole;
  message: string;
}

export type OrganizationStatus =
  | 'ACTIVE'
  | 'INACTIVE';

export interface OrganizationSummary {
  totalDivisions: number;
  totalEmployees: number;
  totalMappedManagers: number;
  unmappedManagers: number;
}

export interface OrganizationDivision {
  id: string;
  code: string;
  name: string;
  headName: string;
  headEmail: string;
  totalEmployees: number;
  status: OrganizationStatus;
}

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  divisionId: string;
  divisionName: string;
  position: string;
  managerId: string | null;
  managerName: string | null;
  managerEmail: string | null;
  status: UserStatus;
}

export interface OrganizationData {
  summary: OrganizationSummary;
  divisions: OrganizationDivision[];
  members: OrganizationMember[];
}

export interface UpdateOrganizationMappingInput {
  userId: string;
  divisionId: string;
  managerId: string | null;
}

export interface UpdateOrganizationMappingResponse {
  userId: string;
  message: string;
}

export type LeaveBalanceAdjustmentType =
  | 'ADD'
  | 'DEDUCT'
  | 'SET';

export interface LeaveBalanceSummary {
  totalEmployees: number;
  totalAllocated: number;
  totalUsed: number;
  totalRemaining: number;
  lowBalanceEmployees: number;
}

export interface LeaveBalanceRecord {
  userId: string;
  name: string;
  email: string;
  division: string;
  year: number;
  openingBalance: number;
  adjustmentBalance: number;
  usedBalance: number;
  remainingBalance: number;
  lastUpdatedAt: string;
  status: UserStatus;
}

export interface LeaveBalanceData {
  year: number;
  summary: LeaveBalanceSummary;
  balances: LeaveBalanceRecord[];
}

export interface UpdateLeaveBalanceInput {
  userId: string;
  year: number;
  adjustmentType: LeaveBalanceAdjustmentType;
  amount: number;
  reason: string;
}

export interface UpdateLeaveBalanceResponse {
  userId: string;
  message: string;
}

export type TaxType =
  | 'PPN'
  | 'PPH';

export interface TaxConfiguration {
  id: string;
  taxType: TaxType;
  name: string;
  rate: number;
  description: string;
  isActive: boolean;
}

export interface TaxConfigurationData {
  configurations: TaxConfiguration[];
}

export interface UpdateTaxConfigurationInput {
  id: string;
  rate: number;
  isActive: boolean;
}

export interface UpdateTaxConfigurationResponse {
  id: string;
  message: string;
}