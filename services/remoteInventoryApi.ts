import { QrCodeInventoryItem } from '../types';

export interface AssignmentPayload {
  token: string;
  memberId: string;
  assignedBy?: string | null;
  assignedAt: string;
}

export interface BatchCreatedPayload {
  records: QrCodeInventoryItem[];
}

const API_BASE = (import.meta as any).env?.VITE_QRATE_API_BASE_URL as string | undefined;

export async function notifyAssignmentToServer(payload: AssignmentPayload): Promise<void> {
  if (!API_BASE) return;
  try {
    await fetch(`${API_BASE}/qr/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Fail silently for now; local state remains the source of truth.
    console.error('Failed to sync QR assignment to server', error);
  }
}

export async function notifyBatchCreatedToServer(payload: BatchCreatedPayload): Promise<void> {
  if (!API_BASE) return;
  try {
    await fetch(`${API_BASE}/qr/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to sync QR batch to server', error);
  }
}

