function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getWeekEnd(date) {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

const now = new Date();
const weekStart = getWeekStart(now);
const weekEnd = getWeekEnd(now);

console.log('Current date:', now.toISOString());
console.log('Week start:', weekStart.toISOString());
console.log('Week end:', weekEnd.toISOString());

// Check if Rigved's match falls within this week
const rigvedMatchDate = new Date('2025-09-18T12:23:00.000Z');
console.log('Rigved match date:', rigvedMatchDate.toISOString());
console.log('Is Rigved match in current week?', rigvedMatchDate >= weekStart && rigvedMatchDate <= weekEnd);
