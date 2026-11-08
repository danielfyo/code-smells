import { Injectable } from '@angular/core';

// SMELL: Long Parameter List. Eight positional parameters, several of the same type: callers
// easily swap `startHour` and `durationMinutes` or the patient name and phone, and the
// compiler cannot help because they are all strings and numbers.
@Injectable({ providedIn: 'root' })
export class ClinicSchedulerSmelly {
  book(
    patientName: string,
    patientPhone: string,
    doctor: string,
    day: string,
    startHour: number,
    durationMinutes: number,
    room: string,
    followUp: boolean,
  ): string {
    const endMinutes = startHour * 60 + durationMinutes;
    const end = `${Math.floor(endMinutes / 60)}:${String(endMinutes % 60).padStart(2, '0')}`;
    const kind = followUp ? 'Follow-up' : 'First visit';
    return `${kind} for ${patientName} (${patientPhone}) with ${doctor} on ${day} ${startHour}:00-${end} in ${room}`;
  }
}
