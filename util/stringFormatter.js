export function limitStringLength(inputString, maxLength) {
  if (inputString.length <= maxLength) {
    return inputString;
  } else {
    return inputString.substring(0, maxLength - 3) + "...";
  }
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
