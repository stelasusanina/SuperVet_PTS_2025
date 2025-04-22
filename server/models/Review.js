class Review {
  constructor(id, vet_id, user_id, rating, comment, created_at) {
    this.id = id;
    this.vet_id = vet_id;
    this.user_id = user_id;
    this.rating = rating;
    this.comment = comment;
    this.created_at = created_at;
  }
}

export default Review;
