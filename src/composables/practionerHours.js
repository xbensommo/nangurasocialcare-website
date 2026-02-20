export const getPractitionerHours = (dateString) => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Weekdays: 19:00 - 21:00 (e.g., 19:00, 20:00)
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  // Weekends: 09:00 - 13:00 (e.g., 09:00, 10:30, 12:00)
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  console.clear()
  console.log(isWeekday, isWeekend)
  if (isWeekday) {
    return ['18:00', '19:00', '20:00']; 
  } else if (isWeekend) {
    return ['09:00', '10:30', '12:00'];
  }
  return [];
};