export interface EmergencyContact {
  name?: string;
  phone?: string;
  email?: string;
}

export interface ISOSPayload {
  contacts: EmergencyContact[];
  initialLocation: { lat: number; lng: number };
  live?: boolean;
  durationMinutes?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export interface ISOSResponse {
  ok: boolean;
  eventId?: string;
  message?: string;
}