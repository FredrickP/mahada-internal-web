export type ITRequestType =
  | 'REQUEST'
  | 'CHANGE'
  | 'INCIDENT';

export type ITRequestStatus =
  | 'SUBMITTED'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED';

export type ITRequestPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH';

export interface ITRequest {
  id: string;
  requestNumber: string;
  title: string;
  type: ITRequestType;
  submissionDate: string;
  status: ITRequestStatus;
  picName?: string;
  description?: string;
  priority?: ITRequestPriority;
  attachmentCount?: number;
}

export interface ITRequestFilter {
  search: string;
  type: ITRequestType | '';
  status: ITRequestStatus | '';
}

export interface CreateITRequestInput {
  type: ITRequestType;
  title: string;
  description: string;
  priority: ITRequestPriority;
  attachments: File[];
}

export interface CreateITRequestPayload {
  type: ITRequestType;
  title: string;
  description: string;
  priority: ITRequestPriority;
  isDraft: boolean;
}

export interface CreateITRequestResponse {
  id: string;
  requestNumber: string;
  status: ITRequestStatus | null;
  isDraft: boolean;
}

export interface ITRequestListResponse {
  data: ITRequest[];
  total: number;
}

export interface SaveITRequestDraftInput {
  type?: ITRequestType;
  title?: string;
  description?: string;
  priority?: ITRequestPriority;
  attachments: File[];
}

export interface ITRequestHistory {
  id: string;
  status: ITRequestStatus;
  actionBy: string;
  actionDate: string;
  notes?: string;
}

export interface ITRequestAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
}

export interface ITRequestDetail extends ITRequest {
  requesterName: string;
  requesterDivision: string;
  requesterEmail?: string;
  attachments: ITRequestAttachment[];
  history: ITRequestHistory[];
}