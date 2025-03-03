import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./ReviewList.css";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [newReview, setNewReview] = useState({
    type: "course",
    title: "",
    rating: 0,
    reviewText: "",
    anonymous: false,
  });

  // Fetch reviews from the backend when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/reviews");
        setReviews(response.data);
      } catch (err) {
        setError("Failed to fetch reviews.");
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  // Function to get the username from the JWT token
  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debugging log
  
    if (!token) {
      setError("You must be logged in to post a review.");
      return null;
    }
  
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded); // Debugging log
      return decoded.username; // Retrieve the username from the token
    } catch (err) {
      console.error("Error decoding token:", err); // Debugging log
      setError("Invalid token. Please log in again.");
      return null;
    }
  };

  

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

  const submitReview = async () => {
    const username = getUsernameFromToken();
    if (!username) return; // Stop if username is not available

    try {
      const reviewData = {
        ...newReview,
        username: newReview.anonymous ? "Anonymous" : username, // Include the username (or "Anonymous")
      };

      // Submit a new review
      const response = await axios.post("http://localhost:5001/api/reviews", reviewData);
      console.log("Review submitted:", response.data);

      // Fetch updated reviews
      const reviewsResponse = await axios.get("http://localhost:5001/api/reviews");
      setReviews(reviewsResponse.data);

      // Reset the form and close the modal
      setNewReview({
        type: "course",
        title: "",
        rating: 0,
        reviewText: "",
        anonymous: false,
      });
      setIsModalOpen(false);

      setSuccess("Review posted successfully!");
    } catch (err) {
      setError("Failed to submit review.");
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="review-list-page">
      <h1>Reviews</h1>
      {error && <p className="error-message">{error}</p>}

      {/* Button to open the modal */}
      <button onClick={() => setIsModalOpen(true)} className="add-review-button">
        Add a Review
      </button>

      {/* Modal for review submission */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Submit a Review</h2>
            <div className="review-form">
              <div className="form-group">
                <label>Review Type:</label>
                <select name="type" value={newReview.type} onChange={handleInputChange}>
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
              <button onClick={submitReview}>Submit Review</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* List of reviews */}
      <div className="reviews-container">
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <h3 className="review-title">
              {review.username} - {review.title} ({review.type})
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;