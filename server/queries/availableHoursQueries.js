export const getFreeHoursByVetIdQuery = `
  SELECT id, vet_id, date_time, is_free
  FROM available_hours
  WHERE vet_id = ? AND is_free = 1;
`;

export const markHourUnavailableQuery = `
  UPDATE available_hours
  SET is_free = 0
  WHERE id = ?
`;
