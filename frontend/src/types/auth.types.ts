export interface UserProfile {
  id: string;
  email: string;
  subscription: string;
  subclose: string;
}

export interface GetUser {
  token: string;
  user: UserProfile;
}
