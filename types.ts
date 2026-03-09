

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