import { UserMinimal } from '@app/interfaces/user-minimal';

/**
 * Represents comment data structure of entry from feed
 */
export interface CommentFeed {
  id: string;
  is_voted: boolean;
  user: UserMinimal;
  is_voted: boolean;
  comment: string;
  created: string;
  updated: string;
}
