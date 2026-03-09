

export interface MedicalCategory {
  id: string;
  name: string;
  cloudLink: string;
}

// Fix: Added the missing MedicalRecord interface, which is used in AddRecordModal.
export interface MedicalRecord {
  id: string;
  recordType: string;
  date: string;
  doctorName: string;
  summary: string;
  fullText: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  bloodType: string;
  profileImageUrl: string;
  /**
   * Optional token that links this patient to a pre-printed QR code.
   * The printed QR should contain only this opaque token (or a claim URL with this token),
   * never the full medical record payload.
   */
  qrToken?: string;
  cloudLink?: string;
  medicalCategories: MedicalCategory[];
  qrCodeData: string;
  customQrCodeImageUrl?: string;
  allergies?: string[];
  currentMedications?: string[];
  lastVisitDate?: string;
}

export interface FamilyAccount {
  id:string;
  familyName: string;
  patients: Patient[];
}

export type QrStatus = 'unassigned' | 'assigned' | 'inactive' | 'lost' | 'replaced';

export interface QrCodeInventoryItem {
  /**
   * Internal ID for this QR inventory record (not printed).
   */
  id: string;
  /**
   * The unique token encoded in the printed QR (or in the claim URL).
   * Example: "QR-8F2A19XK" or any opaque string.
   */
  token: string;
  /**
   * Human-friendly batch name used when this code was generated
   * (for example: "MAR26A").
   */
  batchName?: string;
  /**
   * Numeric serial number within a batch (e.g. 1, 2, 3...).
   */
  serialNumber?: number;
  /**
   * The exact value encoded in the QR image. For now this will
   * usually be the same as `token`, but later can be a full URL
   * like https://yourdomain.com/claim/{token}.
   */
  qrValue?: string;
  status: QrStatus;
  /**
   * The patient id this QR is currently assigned to (if any).
   */
  memberId?: string;
  /**
   * Optional batch identifier for pre-printed runs (e.g. "batch-2026-03").
   */
  batchId?: string;
  createdAt: string;
  assignedAt?: string;
  /**
   * Free-form "sold by" or salesperson identifier.
   */
  assignedBy?: string;
  notes?: string;
}