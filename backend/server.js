import express from 'express';
import cors from 'cors';
import { body, validationResult } from 'express-validator';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Constants
const USER_ID = "sandeep_alhat_30012024";
const EMAIL = "sandeep@college.edu";
const ROLL_NUMBER = "XYZA123";

// Validation middleware
const validateData = [
  body('data').isArray().notEmpty().withMessage('Data must be a non-empty array'),
  body('data.*').isString().withMessage('All elements must be strings')
];

// Process array function
const processArray = (data) => {
  const numbers = data.filter(item => /^\d+$/.test(item));
  const alphabets = data.filter(item => /^[A-Za-z]$/.test(item));
  const highest_alphabet = alphabets.length > 0 
    ? [alphabets.reduce((a, b) => a.toLowerCase() > b.toLowerCase() ? a : b)]
    : [];

  return { numbers, alphabets, highest_alphabet };
};

// GET endpoint
app.get('/bfhl', (req, res) => {
  res.json({ operation_code: 1 });
});

// POST endpoint
app.post('/bfhl', validateData, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      is_success: false,
      errors: errors.array()
    });
  }

  try {
    const { data } = req.body;
    const { numbers, alphabets, highest_alphabet } = processArray(data);

    res.json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_alphabet
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      error: 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
