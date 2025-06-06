export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked?: boolean;
  subscription: string;
  status: string;
  amount: number;
  mode: string;
  orderReference: string;
  regularDateEnd?: Date;
  lastPayedStatus?: string;
  lastPayedDate?: Date;
  substart: Date;
  subend: Date;
  dailyDownloadCount: number;
  createdAt: string;
}

export interface GetUser {
  token: string;
  user: UserProfile;
}

export interface UserRegProfile {
  name: string;
  email: string;
  phone: string;
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
