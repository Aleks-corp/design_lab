export interface UserProfile {
  id: string;
  name: string;
  email: string;
  subscription: string;
  substart: number;
  subend: number;
}

export interface GetUser {
  token: string;
  user: UserProfile;
}

export interface UserRegProfile {
  name: string;
  email: string;
  password: string;
}

export interface UserLogProfile {
  email: string;
  password: string;
}

export interface UserForgotProfile {
  email: string;
}

export interface UserNewPassProfile {
  newPassToken: string;
  password: string;
}

export interface UserChangePassProfile {
  oldPassword: string;
  newPassword: string;
}
