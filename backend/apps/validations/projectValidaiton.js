const Joi = require('joi');

// Define the validation schema for project input
const projectSchema = Joi.object({
  project_name: Joi.string().min(3).max(100).required()
    .messages({
      'string.empty': 'Project name is required',
      'string.min': 'Project name must be at least 3 characters',
      'string.max': 'Project name must be less than 100 characters',
    }),
  project_description: Joi.string().min(10).max(500).required()
    .messages({
      'string.empty': 'Project description is required',
      'string.min': 'Project description must be at least 10 characters',
      'string.max': 'Project description must be less than 500 characters',
    }),
  project_type: Joi.string().valid('open', 'closed').optional()
    .messages({
      'any.only': 'Project type must be either "open" or "closed"',
    }),
  project_image: Joi.string().required()
    .pattern(/^[^\\/:*?"<>|]+\.((png|jpg|jpeg|gif|webp|svg))$/i)  
    .messages({
      'string.empty': 'Project image name is required',
      'string.pattern.base': 'Project image must be a valid image name',
    }),
  project_date: Joi.date().optional()
    .messages({
      'date.base': 'Project date must be a valid date',
    }),
});

// Middleware to validate project input
async function validateProjectInput(req, res, next) {
  try {
    // Validate the request body against the schema
    const { error } = projectSchema.validate(req.body, { abortEarly: false });

    if (error) {
      // Collect all validation errors
      const errors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    // If validation passes, proceed to the next middleware
    next();
  } catch (err) {
    console.error('Error during validation:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  ...module.exports, // Keep existing exports
  validateProjectInput, // Add the new project validation middleware
};