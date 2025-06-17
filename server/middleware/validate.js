function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    console.log('Validating request body:', req.body);
    console.log('Validation result:', error);
    if (error) {
      return res.status(400).json({
        message: 'Validacijska greška',
        details: error.details.map(d => d.message),
      });
    }
    next();
  };
};

module.exports = { validate };