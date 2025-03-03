const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// POST /api/reviews - Create a new review
router.post("/", async (req, res) => {
  try {
    const { type, title, rating, reviewText, username } = req.body;
    const review = new Review({ type, title, rating, reviewText, username });
    await review.save();
    res.status(201).json({ message: "Review created successfully!", review });
  } catch (err) {
    res.status(500).json({ message: "Failed to create review.", error: err.message });
  }
});

// GET /api/reviews - Fetch all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews.", error: err.message });
  }
});

// DELETE /api/reviews/:id - Delete a review
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body; // Get the username from the request body

    // Find the review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Check if the logged-in user is the author
    if (review.username !== username) {
      return res.status(403).json({ message: "You are not authorized to delete this review." });
    }

    // Delete the review
    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: "Review deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review.", error: err.message });
  }
});

// PUT /api/reviews/:id - Update a review
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, rating, reviewText, username } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.username !== username) {
      return res.status(403).json({ message: "You are not authorized to edit this review." });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { type, title, rating, reviewText },
      { new: true }
    );

    res.status(200).json({ message: "Review updated successfully!", review: updatedReview });
  } catch (err) {
    res.status(500).json({ message: "Failed to update review.", error: err.message });
  }
});

module.exports = router;