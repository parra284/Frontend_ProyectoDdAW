// Helper function for validation
const onlyLetters = {
  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
  message: 'This field can only contain letters',
};

// Fields array
export const authFields = [
  {
    name: "name",
    validation: {
      required: "This field is required",
      pattern: onlyLetters,
    },
  },
  {
    name: "lastName",
    validation: {
      pattern: onlyLetters,
    },
  },
  {
    name: "email",
    validation: {
      required: "This field is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
    },
  },
  {
    name: "password",
    validation: {
      required: "This field is required",
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters long',
      },
    },
  },
];

export const productFields = [
  {
    name: "name",
    validation: {
      required: "This field is required",
      pattern: onlyLetters
    },
  },
  {
    name: "category",
    validation: {
      required: "This field is required",
      pattern: onlyLetters
    },
  },
  {
    name: "description",
    validation: {
      required: "This field is required",
      pattern: onlyLetters
    },
  },
  {
    name: "location",
    validation: {
      required: "This field is required",
      pattern: onlyLetters
    },
  },
  {
    name: "stock",
    validation: {
      required: "This field is required",
      pattern: {
        value: /^[0-9]+$/,
        message: "This field can only contain numbers",
      },
    },
  },
];