import { TeamRoles } from '@app/enums/team-roles';
import { UserMin } from '@app/interfaces/v1/user-min';

export interface TeamMember {
  role: TeamRoles;
  user: UserMin;
}
