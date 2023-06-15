export interface UserInterface {
  _id?: string;
  uuid?: string;
  firstName?: string;
  lastName?: string;
  avatarSrc?: string;
  subdomain?: string;
  bio?: string;
  socialProfiles?: Array<{ title: string; url: string }>;
  email?: string;
  password?: string;
  refreshToken?: string;
  refreshTokenExpiresIn?: Date;
}
