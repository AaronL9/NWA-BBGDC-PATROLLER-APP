export const formatFirebaseDate = (firebaseDate) => {
  const date = new Date(
    firebaseDate.seconds * 1000 + firebaseDate.nanoseconds / 1000000
  );
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${formattedHours}:${formattedMinutes} ${period}`;
};
