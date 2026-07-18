export const validateName = {
  required: "Name is required",

  minLength: {
    value: 3,

    message: "Minimum 3 characters",
  },
};

export const validatePhone = {
  required: "Phone number is required",

  pattern: {
    value: /^[6-9]\d{9}$/,

    message: "Invalid mobile number",
  },
};

export const validateEmail = {
  required: "Email is required",

  pattern: {
    value: /^\S+@\S+\.\S+$/,

    message: "Invalid Email",
  },
};

export const validatePatrol = {
  required: "Patrol Name Required",
};
