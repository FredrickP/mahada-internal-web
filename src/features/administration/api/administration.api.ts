import { apiClient } from '../../../lib/api/api-client';

import {
  createMockUser,
  getMockAdministration,
  getMockLeaveBalances,
  getMockOrganization,
  getMockRolePermission,
  getMockRoles,
  getMockUserDetail,
  getMockUsers,
  getMockTaxConfigurations,
  updateMockTaxConfiguration,
  updateMockLeaveBalance,
  updateMockOrganizationMapping,
  updateMockRole,
  updateMockRolePermission,
  updateMockUser,
} from '../mocks/administration.mock';

import type {
  AdministrationData,
  AdministrationRole,
  AdministrationUser,
  CreateUserInput,
  LeaveBalanceData,
  OrganizationData,
  RolePermissionDetail,
  TaxConfigurationData,
  UpdateTaxConfigurationInput,
  UpdateTaxConfigurationResponse,
  UpdateLeaveBalanceInput,
  UpdateLeaveBalanceResponse,
  UpdateOrganizationMappingInput,
  UpdateOrganizationMappingResponse,
  UpdateRoleInput,
  UpdateRolePermissionInput,
  UpdateRolePermissionResponse,
  UpdateUserInput,
  UserMutationResponse,
  UserRole,
} from '../types/administration.types';

const useMock =
  import.meta.env.VITE_USE_MOCK === 'true';

export const getAdministration = async (): Promise<
  AdministrationData
> => {
  if (useMock) {
    return getMockAdministration();
  }

  const response =
    await apiClient.get<AdministrationData>(
      '/administration',
    );

  return response.data;
};

export const getUsers = async (): Promise<
  AdministrationUser[]
> => {
  if (useMock) {
    return getMockUsers();
  }

  const response =
    await apiClient.get<
      AdministrationUser[]
    >('/administration/users');

  return response.data;
};

export const getUserDetail = async (
  id: string,
): Promise<AdministrationUser> => {
  if (useMock) {
    return getMockUserDetail(id);
  }

  const response =
    await apiClient.get<AdministrationUser>(
      `/administration/users/${id}`,
    );

  return response.data;
};

export const createUser = async (
  input: CreateUserInput,
): Promise<UserMutationResponse> => {
  if (useMock) {
    return createMockUser(input);
  }

  const response =
    await apiClient.post<UserMutationResponse>(
      '/administration/users',
      input,
    );

  return response.data;
};

export const updateUser = async (
  id: string,
  input: UpdateUserInput,
): Promise<UserMutationResponse> => {
  if (useMock) {
    return updateMockUser(
      id,
      input,
    );
  }

  const response =
    await apiClient.put<UserMutationResponse>(
      `/administration/users/${id}`,
      input,
    );

  return response.data;
};

export const getRoles = async (): Promise<
  AdministrationRole[]
> => {
  if (useMock) {
    return getMockRoles();
  }

  const response =
    await apiClient.get<
      AdministrationRole[]
    >('/administration/roles');

  return response.data;
};

export const updateRole = async (
  input: UpdateRoleInput,
): Promise<UserMutationResponse> => {
  if (useMock) {
    return updateMockRole(input);
  }

  const response =
    await apiClient.put<UserMutationResponse>(
      `/administration/roles/${input.role}`,
      {
        description:
          input.description,
      },
    );

  return response.data;
};

export const getRolePermission = async (
  role: UserRole,
): Promise<RolePermissionDetail> => {
  if (useMock) {
    return getMockRolePermission(
      role,
    );
  }

  const response =
    await apiClient.get<RolePermissionDetail>(
      `/administration/roles/${role}/permissions`,
    );

  return response.data;
};

export const updateRolePermission = async (
  input: UpdateRolePermissionInput,
): Promise<UpdateRolePermissionResponse> => {
  if (useMock) {
    return updateMockRolePermission(
      input,
    );
  }

  const response =
    await apiClient.put<UpdateRolePermissionResponse>(
      `/administration/roles/${input.role}/permissions`,
      {
        permissions:
          input.permissions,
      },
    );

  return response.data;
};

export const getOrganization = async (): Promise<
  OrganizationData
> => {
  if (useMock) {
    return getMockOrganization();
  }

  const response =
    await apiClient.get<OrganizationData>(
      '/administration/organization',
    );

  return response.data;
};

export const updateOrganizationMapping = async (
  input: UpdateOrganizationMappingInput,
): Promise<UpdateOrganizationMappingResponse> => {
  if (useMock) {
    return updateMockOrganizationMapping(
      input,
    );
  }

  const response =
    await apiClient.put<UpdateOrganizationMappingResponse>(
      `/administration/organization/members/${input.userId}`,
      {
        divisionId:
          input.divisionId,
        managerId:
          input.managerId,
      },
    );

  return response.data;
};

export const getLeaveBalances = async (
  year: number,
): Promise<LeaveBalanceData> => {
  if (useMock) {
    return getMockLeaveBalances(
      year,
    );
  }

  const response =
    await apiClient.get<LeaveBalanceData>(
      '/administration/leave-balances',
      {
        params: {
          year,
        },
      },
    );

  return response.data;
};

export const updateLeaveBalance = async (
  input: UpdateLeaveBalanceInput,
): Promise<UpdateLeaveBalanceResponse> => {
  if (useMock) {
    return updateMockLeaveBalance(
      input,
    );
  }

  const response =
    await apiClient.put<UpdateLeaveBalanceResponse>(
      `/administration/leave-balances/${input.userId}`,
      {
        year:
          input.year,
        adjustmentType:
          input.adjustmentType,
        amount:
          input.amount,
        reason:
          input.reason,
      },
    );

  return response.data;
};

export const getTaxConfigurations = async (): Promise<
  TaxConfigurationData
> => {
  if (useMock) {
    return getMockTaxConfigurations();
  }

  const response =
    await apiClient.get<TaxConfigurationData>(
      '/administration/tax-configurations',
    );

  return response.data;
};

export const updateTaxConfiguration = async (
  input: UpdateTaxConfigurationInput,
): Promise<UpdateTaxConfigurationResponse> => {
  if (useMock) {
    return updateMockTaxConfiguration(
      input,
    );
  }

  const response =
    await apiClient.put<UpdateTaxConfigurationResponse>(
      `/administration/tax-configurations/${input.id}`,
      {
        rate: input.rate,
        isActive: input.isActive,
      },
    );

  return response.data;
};