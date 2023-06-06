export interface UserInterface {
  userName?: string;
  firstName?: string;
  lastName?: string;
  shortBio?: string;
  avatar?: {
    alt: string;
    path: string;
  };
  accountUrl?: {
    url: string;
    prefix: string;
  };
  email?: string;
  password?: string;
  from?: {
    country?: string;
    city?: string;
  };
  roles?: string[];
  uuid?: string;
  _id?: string;
  refreshToken?: string;
  refreshTokenExpiresIn?: Date;
}
