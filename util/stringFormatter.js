export function limitStringLength(inputString, maxLength) {
  if (inputString.length <= maxLength) {
    return inputString;
  } else {
    return inputString.substring(0, maxLength - 3) + "...";
  }
}

export function truncateAndAddDots(inputString) {
  const maxLength = 21;

  if (inputString.length > maxLength) {
    const truncatedString = inputString.slice(0, maxLength - 3);
    return truncatedString + "...";
  }
  return inputString;
}

export const extractFilename = (uri) => {
  const pathArray = uri.split("/");
  return pathArray[pathArray.length - 1];
};

export function trimObjectStrings(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const trimmedObject = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === "string") {
        trimmedObject[key] = value.trim();
      } else if (typeof value === "object") {
        // Recursively trim string properties of nested objects
        trimmedObject[key] = trimObjectStrings(value);
      } else {
        // Leave non-string and non-object values unchanged
        trimmedObject[key] = value;
      }
    }
  }

  return trimmedObject;
}

export const extractErrorMessage = (errorCode) => {
  if (!errorCode || typeof errorCode !== "string") {
    return "An unexpected error occurred";
  }

  if (errorCode.startsWith("auth/")) {
    const errorMessage = errorCode.split("/");
    errorMessage.shift();
    const extractErrorMessage = errorMessage[0].split("-").join(" ");

    const formattedMessage =
      extractErrorMessage.charAt(0).toUpperCase() +
      extractErrorMessage.slice(1);

    return formattedMessage;
  } else {
    return errorCode;
  }
};

export function formatPhoneNumber(input, setError) {
  if (/^\+639\d{9}$/.test(input) && input.length === 13) {
    return input;
  }

  if (/^09\d{9}$/.test(input) && input.length === 11) {
    return "+63" + input.slice(1);
  }

  setError("Invalid phone number");
  return null;
}
