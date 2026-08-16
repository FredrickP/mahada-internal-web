import { apiClient } from '../../../lib/api/api-client';

import {
  dashboardSummaryMock,
  quickActionsMock,
  recentSubmissionsMock,
} from '../mocks/dashboard.mock';

import type {
  DashboardData,
} from '../types/dashboard.types';

const useMock =
  import.meta.env.VITE_USE_MOCK === 'true';

const getDashboardMock =
  async (): Promise<DashboardData> => {
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    return {
      summary: dashboardSummaryMock,
      quickActions: quickActionsMock,
      recentSubmissions: recentSubmissionsMock,
    };
  };

export const getDashboard =
  async (): Promise<DashboardData> => {
    if (useMock) {
      return getDashboardMock();
    }

    const response =
      await apiClient.get<DashboardData>(
        '/dashboard',
      );

    return response.data;
  };