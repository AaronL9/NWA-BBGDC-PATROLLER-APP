export const signUpInitValue = {
  firstName: "",
  lastName: "",
  email: "",
  contactNum: "",
  password: "",
  confirmPassword: "",
};

export const loginFieldProps = (setCredential) => {
  return {
    identifier: {
      icon: "person",
      placeholder: "Username or phone number",
      customStyle: { width: "100%" },
      changeTextHandler: (enteredText) =>
        onChangeValueHandler("identifier", setCredential, enteredText),
    },
    passowrd: {
      icon: "lock-closed",
      placeholder: "Password",
      customStyle: { width: "100%" },
      isPassword: true,
      changeTextHandler: (enteredText) =>
        onChangeValueHandler("password", setCredential, enteredText),
    },
  };
};

export const credentialFieldProps = (setCredential) => {
  return {
    firstName: {
      icon: "person",
      placeholder: "First Name",
      customStyle: { flex: 1 },
      changeTextHandler: (enteredText) =>
        onChangeValueHandler("firstName", setCredential, enteredText),
    },
    lastName: {
      icon: "person",
      placeholder: "Last Name",
      customStyle: { flex: 1 },
      changeTextHandler: (enteredText) =>
        onChangeValueHandler("lastName", setCredential, enteredText),
    },
    email: {
      icon: "person",
      placeholder: "Username or phone number",
      customStyle: { width: "100%" },
      changeTextHandler: (enteredText) =>
        onChangeValueHandler("email", setCredential, enteredText),
    },
    phone: {
      icon: "phone-portrait",
      placeholder: "Phone Number",
      customStyle: { width: "100%" },
      inputType: "numeric",
      changeTextHandler: (enteredText) =>
        onChangeValueHandler("contactNum", setCredential, enteredText),
    },
    passowrd: {
      icon: "lock-closed",
      placeholder: "Password",
      customStyle: { width: "100%" },
      isPassword: true,
      changeTextHandler: (enteredText) =>
        onChangeValueHandler("password", setCredential, enteredText),
    },
    confirmPassword: {
      icon: "lock-closed",
      placeholder: "Confirm Password",
      customStyle: { width: "100%" },
      isPassword: true,
      changeTextHandler: (enteredText) =>
        onChangeValueHandler("confirmPassword", setCredential, enteredText),
    },
  };
};

const onChangeValueHandler = (identifier, setCredential, enteredText) => {
  const value = identifier.includes("assword")
    ? enteredText
    : enteredText.trim();

  setCredential((prev) => {
    return {
      ...prev,
      [identifier]: value,
    };
  });
};
