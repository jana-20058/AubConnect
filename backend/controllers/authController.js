const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../services/emailService'); // Import the email service
const crypto = require('crypto');

// Generate a random 6-digit verification code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendVerificationCode = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered', error: 'EMAIL_ALREADY_EXISTS' });
    }

    // Check if the username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username is already taken', error: 'USERNAME_ALREADY_EXISTS' });
    }

    // Generate a verification code
    const verificationCode = generateVerificationCode();

    // Save the user data and verification code
    await User.findOneAndUpdate(
      { email },
      {
        name,
        username,
        email,
        password,
        verificationCode,
        verificationCodeExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      },
      { upsert: true, new: true }
    );

    // Send the verification code via email
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (err) {
    console.error('Error sending verification code:', err);
    res.status(500).json({ message: 'Failed to send verification code', error: err.message });
  }
};

// Send verification code to the user's email
// const sendVerificationCode = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if the email is already registered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already registered', error: 'EMAIL_ALREADY_EXISTS' });
//     }

//     // Generate a verification code
//     const verificationCode = generateVerificationCode();

//     // Save the verification code and its expiration time (e.g., 10 minutes from now)
//     await User.findOneAndUpdate(
//       { email },
//       {
//         verificationCode,
//         verificationCodeExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
//       },
//       { upsert: true, new: true }
//     );

//     // Send the verification code via email
//     await sendVerificationEmail(email, verificationCode);

//     res.status(200).json({ message: 'Verification code sent successfully' });
//   } catch (err) {
//     console.error('Error sending verification code:', err);
//     res.status(500).json({ message: 'Failed to send verification code', error: err.message });
//   }
// };

// Verify the code entered by the user
const verifyCode = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found', error: 'USER_NOT_FOUND' });
    }

    // Check if the code matches and is not expired
    if (
      user.verificationCode === verificationCode &&
      user.verificationCodeExpires > Date.now()
    ) {
      // Mark the user as verified
      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();

      res.status(200).json({ message: 'Email verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid or expired verification code', error: 'INVALID_VERIFICATION_CODE' });
    }
  } catch (err) {
    console.error('Error verifying code:', err);
    res.status(500).json({ message: 'Failed to verify code', error: err.message });
  }
};

const signup = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found', error: 'USER_NOT_FOUND' });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Generate JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Server error occurred', error: err.message });
  }
};

// Signup
// const signup = async (req, res) => {
//   const { name, username, email, password } = req.body;

//   try {
//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: 'User already exists', error: 'EMAIL_ALREADY_EXISTS' });
//     }

//     // Check if username is already taken
//     user = await User.findOne({ username });
//     if (user) {
//       return res.status(400).json({ message: 'Username is already taken', error: 'USERNAME_ALREADY_EXISTS' });
//     }

//     // Check if the email is verified
//     const verifiedUser = await User.findOne({ email, isVerified: true });
//     if (!verifiedUser) {
//       return res.status(400).json({ message: 'Email not verified', error: 'EMAIL_NOT_VERIFIED' });
//     }

//     // Create new user
//     user = new User({ name, username, email, password });
//     await user.save();

//     // Generate JWT
//     const payload = { userId: user._id };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(201).json({ token });
//   } catch (err) {
//     console.error('Error during signup:', err);
//     res.status(500).json({ message: 'Server error occurred', error: err.message });
//   }
// };

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials - User not found', error: 'USER_NOT_FOUND' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials - Incorrect password', error: 'INCORRECT_PASSWORD' });
    }

    // Generate JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error occurred', error: err.message });
  }
};

module.exports = { signup, login, sendVerificationCode, verifyCode };