import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ISignUpRequest } from 'dto/requests/ISignUp.Request';
import { ISignInRequest } from 'dto/requests/ISignIn.Request';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/CurrentUser.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signin')
  async signIn(@Body() payload: ISignInRequest) {
    return this.userService.signIn(payload);
  }
  
  @Post('signup')
  async signUp(@Body() payload: ISignUpRequest) {
      return this.userService.signUp(payload);
  }

  @Get('me')
  async getMe(@CurrentUser() currentUser: User) {
    return this.userService.getMe(currentUser);
  }
}
