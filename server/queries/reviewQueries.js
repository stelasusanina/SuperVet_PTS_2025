export const addNewReviewQuery =
  "INSERT INTO reviews (vet_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, GETDATE());";

export const getUserIdByNameQuery = `
  SELECT TOP 1 id FROM users WHERE firstName = ? AND lastName = ?;
`;
