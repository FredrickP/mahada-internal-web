import type {
  SubmissionModule,
} from '../types/dashboard.types';

const submissionModuleRoutes: Record<
  SubmissionModule,
  string
> = {
  IT_REQUEST: '/it-request',
  LEAVE: '/hr-services',
  BUSINESS_TRIP: '/hr-services',
  PAYMENT: '/payment',
};

export const getSubmissionModuleRoute = (
  module: SubmissionModule,
): string => {
  return submissionModuleRoutes[module];
};