export type AuthFormMode =
  | "sign-in"
  | "sign-up"
  | "forgot-password"
  | "reset-password"
  | "verify-email";

export type SignInInput = {
  email: string;
  password: string;
};

export type RegisterInput = SignInInput & {
  name: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type AuthFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  token: string;
};