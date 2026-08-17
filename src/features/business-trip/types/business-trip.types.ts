export type BusinessTripStatus =
  | 'SUBMITTED'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED';

export type BusinessTripEvidenceType =
  | 'IMAGE'
  | 'PDF'
  | 'FILE';

export interface CreateBusinessTripInput {
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  estimatedCost: number;
}

export interface CreateBusinessTripResponse {
  id: string;
  requestNumber: string;
  message: string;
}

export interface BusinessTripEvidence {
  id: string;
  fileName: string;
  fileUrl?: string;
  fileType?: BusinessTripEvidenceType;
  uploadedAt: string;
}

export interface BusinessTripHistory {
  id: string;
  status: BusinessTripStatus;
  label: string;
  date: string;
  note?: string;
}

export interface BusinessTripDetail {
  id: string;
  requestNumber: string;
  employeeName: string;
  employeeDivision: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  estimatedCost: number;
  status: BusinessTripStatus;
  evidences: BusinessTripEvidence[];
  history: BusinessTripHistory[];
}

export interface UploadBusinessTripEvidenceInput {
  tripId: string;
  file: File;
}

export interface UploadBusinessTripEvidenceResponse {
  tripId: string;
  evidence: BusinessTripEvidence;
  message: string;
}