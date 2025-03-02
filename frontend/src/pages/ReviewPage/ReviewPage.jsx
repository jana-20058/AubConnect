import React, { useState } from "react";
import "./ReviewPage.css";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    type: "course",
    title: "",
    rating: 0,
    reviewText: "",
    anonymous: false,
  });
  const [editReviewId, setEditReviewId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewReview({
      ...newReview,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const submitReview = () => {
    if (editReviewId !== null) {
      const updatedReviews = reviews.map((review) =>
        review.id === editReviewId ? { ...review, ...newReview } : review
      );
      setReviews(updatedReviews);
      setEditReviewId(null);
    } else {
      const review = { ...newReview, id: Date.now(), upvotes: 0, downvotes: 0 };
      setReviews([...reviews, review]);
    }
    setNewReview({
      type: "course",
      title: "",
      rating: 0,
      reviewText: "",
      anonymous: false,
    });
  };

  const editReview = (id) => {
    const reviewToEdit = reviews.find((review) => review.id === id);
    setNewReview(reviewToEdit);
    setEditReviewId(id);
  };

  const deleteReview = (id) => {
    const updatedReviews = reviews.filter((review) => review.id !== id);
    setReviews(updatedReviews);
  };

  const handleVote = (id, type) => {
    const updatedReviews = reviews.map((review) =>
      review.id === id
        ? {
            ...review,
            upvotes: type === "upvote" ? review.upvotes + 1 : review.upvotes,
            downvotes: type === "downvote" ? review.downvotes + 1 : review.downvotes,
          }
        : review
    );
    setReviews(updatedReviews);
  };

  return (
    <div className="review-page">
      <h1 className="header">AUB Review Hub</h1>
      <div className="review-form">
        <div className="form-group">
          <label>Review Type:</label>
          <select
            name="type"
            value={newReview.type}
            onChange={handleInputChange}
          >
            <option value="course">Course</option>
            <option value="professor">Professor</option>
          </select>
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={newReview.title}
            onChange={handleInputChange}
            placeholder="Enter course or professor name"
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= newReview.rating ? "filled" : ""}`}
                onClick={() => handleRatingChange(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Review:</label>
          <textarea
            name="reviewText"
            value={newReview.reviewText}
            onChange={handleInputChange}
            placeholder="Write your review here..."
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="anonymous"
              checked={newReview.anonymous}
              onChange={handleInputChange}
            />
            Submit Anonymously
          </label>
        </div>
        <button onClick={submitReview}>
          {editReviewId !== null ? "Update Review" : "Submit Review"}
        </button>
      </div>

      <div className="reviews-list">
        <h2>Latest Reviews</h2>
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h3 className="review-title">
              {review.anonymous ? "Anonymous" : "User"} - {review.title} ({review.type})
            </h3>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= review.rating ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
            <p>{review.reviewText}</p>
            <div className="actions">
              <button onClick={() => editReview(review.id)} className="action-btn">Edit</button>
              <button onClick={() => deleteReview(review.id)} className="action-btn">Delete</button>
              <button onClick={() => handleVote(review.id, "upvote")} className="vote-btn">Upvote ({review.upvotes})</button>
              <button onClick={() => handleVote(review.id, "downvote")} className="vote-btn">Downvote ({review.downvotes})</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;
