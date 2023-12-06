export const validateSignUpForm = (values, setErrors) => {
  const errors = {};

  if (!values.firstName.trim()) {
    errors.firstName = "First Name is required";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Last Name is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Invalid email format";
  }

  if (!values.contactNum.trim()) {
    errors.contactNum = "Contact Number is required";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm Password is required";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  setErrors(errors);
  return Object.keys(errors).length === 0;
};

export const validateLoginForm = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-login-credentials":
      return "Invalid login credentials";
    case "auth/invalid-email":
      return "Invalid Email";
    case "auth/missing-password":
      return "Missing password";
  }
};
