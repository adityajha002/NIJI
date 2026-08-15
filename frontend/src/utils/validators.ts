export const isValidPincode = (pincode: string): boolean => {
  return /^\d{6}$/.test(pincode);
};

export const hasNoSpaces = (str: string): boolean => {
  return !str.includes(' ');
};
