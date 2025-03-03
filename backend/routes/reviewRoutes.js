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
    const reviews = await Review.find(); // Fetch reviews from the database
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews.", error: err.message });
  }
});

// DELETE /api/reviews/:id - Delete a review
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the review
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found." });
    }

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

    // Find and delete the old review
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Create a new review with the updated data
    const newReview = new Review({ type, title, rating, reviewText, username });
    await newReview.save();

    res.status(200).json({ message: "Review updated successfully!", review: newReview });
  } catch (err) {
    res.status(500).json({ message: "Failed to update review.", error: err.message });
  }
});


module.exports = router;