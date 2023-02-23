import { Body, Controller, Get, Patch } from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from '../auth/decorator'
import { EditUserDto } from './dto/edit-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return this.userService.getUser(user.id)
  }
  @Patch('me')
  editUser(@Body() dto: EditUserDto, @GetUser('id') userId: string) {
    return this.userService.editUser(userId, dto)
  }
}
