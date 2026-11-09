export interface BookingSlot {
  start_time: string;
  end_time: string;
  is_reserved: boolean;
}

export function localDateValue(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function canBookSlot(date: string, slot: BookingSlot, now = new Date()) {
  return !slot.is_reserved && new Date(`${date}T${slot.start_time}`).getTime() > now.getTime();
}