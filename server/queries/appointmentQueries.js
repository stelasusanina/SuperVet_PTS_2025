export const createAppointmentQuery = `
  INSERT INTO appointments (user_id, vet_id, date_time)
  VALUES (?, ?, ?);
`;