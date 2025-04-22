export const getAllVetsQuery = `
  SELECT 
    v.id, 
    v.firstName, 
    v.lastName, 
    v.specialization, 
    v.phone_number,
    ISNULL(ROUND(AVG(r.rating), 2), 0) AS avg_rating
  FROM vets v
  LEFT JOIN reviews r ON v.id = r.vet_id
  GROUP BY v.id, v.firstName, v.lastName, v.specialization, v.phone_number;
`;

export const getVetByIdWithReviewsQuery =
  "SELECT v.id AS vetId, v.firstName AS vetFirstName, v.lastName AS vetLastName, v.specialization, v.phone_number, r.id AS reviewId, r.vet_id, r.user_id, r.rating, r.comment, r.created_at, u.firstName AS userFirstName, u.lastName AS userLastName FROM vets v LEFT JOIN reviews r ON v.id = r.vet_id LEFT JOIN users u ON r.user_id = u.id WHERE v.id = ? ORDER BY r.created_at DESC";