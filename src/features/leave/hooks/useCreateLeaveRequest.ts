import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createLeaveRequest,
  saveLeaveDraft,
} from '../api/leave.api';

import type {
  CreateLeaveRequestInput,
  SaveLeaveDraftInput,
} from '../types/leave.types';

export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();

  const invalidateHRServices = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['hr-services'],
    });
  };

  const createMutation = useMutation({
    mutationFn: (
      input: CreateLeaveRequestInput,
    ) => {
      return createLeaveRequest(input);
    },
    onSuccess: async () => {
      await invalidateHRServices();
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: (
      input: SaveLeaveDraftInput,
    ) => {
      return saveLeaveDraft(input);
    },
    onSuccess: async () => {
      await invalidateHRServices();
    },
  });

  return {
    createMutation,
    saveDraftMutation,
  };
};