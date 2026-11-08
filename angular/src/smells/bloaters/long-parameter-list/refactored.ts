import { Injectable } from '@angular/core';

// REFACTOR: Introduce Parameter Object. Values that belong together become small named types.
export interface Patient {
  name: string;
  phone: string;
}

export interface TimeSlot {
  day: string;
  startHour: number;
  durationMinutes: number;
}

export interface AppointmentRequest {
  patient: Patient;
  doctor: string;
  slot: TimeSlot;
  room: string;
  kind: 'first-visit' | 'follow-up';
}

// REFACTOR: Extract Function. The slot knows how to describe itself.
export function describeSlot({ day, startHour, durationMinutes }: TimeSlot): string {
  const endMinutes = startHour * 60 + durationMinutes;
  const end = `${Math.floor(endMinutes / 60)}:${String(endMinutes % 60).padStart(2, '0')}`;
  return `${day} ${startHour}:00-${end}`;
}

@Injectable({ providedIn: 'root' })
export class ClinicSchedulerRefactored {
  // REFACTOR: a single, self-describing argument; call sites read like named arguments and the
  // boolean flag became a union type.
  book({ patient, doctor, slot, room, kind }: AppointmentRequest): string {
    const label = kind === 'follow-up' ? 'Follow-up' : 'First visit';
    return `${label} for ${patient.name} (${patient.phone}) with ${doctor} on ${describeSlot(slot)} in ${room}`;
  }
}
