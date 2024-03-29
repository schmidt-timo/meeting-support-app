export const validateEmailRegex = new RegExp(
  "[\u00C0-\u017Fa-zA-Z0-9._%+-]+@[\u00C0-\u017Fa-zA-Z0-9.-]+.[a-zA-Z]{2,4}$"
);

export const validateNumberRegex = new RegExp(
  "([1-9]|[0-9][0-9]|[1-9][0-9][0-9])"
);

export const isMeetingIdRegex = new RegExp("[A-Z0-9]{10}");
