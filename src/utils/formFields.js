// Helper function for validation
const onlyLetters = {
  value: /^[A-Za-z]+$/,
  message: 'This field can only contain letters',
};

// Fields array
export const fields = [
  {
    name: "name",
    validation: {
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
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
    },
  },
  {
    name: "password",
    validation: {
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters long',
      },
    },
  },
];