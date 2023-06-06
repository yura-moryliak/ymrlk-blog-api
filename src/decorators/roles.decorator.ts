import { SetMetadata } from '@nestjs/common';

import { RoleEnum } from '../roles/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
