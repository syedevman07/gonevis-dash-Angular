import { UserBlog } from '@app/interfaces/user-blog';

export interface UserAuth {
  email: string;
  get_absolute_uri: string;
  has_verified_email: boolean;
  id: string;
  is_active: boolean;
  media: {
    picture: string;
    thumbnail_48x48: string;
    thumbnail_128x128: string;
    thumbnail_256x256: string;
  };
  name: string;
  receive_email_notification: boolean;
  sites: UserBlog[];
  tour: {
    files: boolean;
    main: boolean;
    settings: boolean;
    user: boolean;
  };
  username: boolean;
}