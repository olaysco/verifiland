import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from 'src/roles/has-roles.decorator';
import { Role } from '../roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  getUserByEmail(@Req() req) {
    return this.userService.getUserByEmail(req.user.username);
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(`all`)
  getAllUsers(@Param() param) {
    return this.userService.getAllUsers();
  }
}
