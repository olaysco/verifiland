import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/roles/roles.enum';

export const HasRoles = (...roles: Role[]) => SetMetadata('roles', roles);
