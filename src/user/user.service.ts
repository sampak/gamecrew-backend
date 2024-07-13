import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ISignUpRequest } from '../dto/requests/ISignUp.Request';
import { PrismaService } from 'src/prisma.service';
import { genJWTToken } from 'src/utils/jwt';
import * as bcrypt from 'bcrypt';
import { config } from 'src/config';
import { ISignInRequest } from '../dto/requests/ISignIn.Request';
import { User } from '@prisma/client';
import { prismaUserToUser } from 'src/adapters/prismaUserToUser';
import { ERROR_CODES } from 'src/config/constants';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async signIn(payload: ISignInRequest) {
    const prismaUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: payload.email },
          { login: payload.email }
        ]
      }, 
    })

    if(!prismaUser) {
      throw new NotFoundException(ERROR_CODES.NOT_FOUND);
    }

    if (!bcrypt.compareSync(payload.password, prismaUser.password)) {
      throw new NotFoundException(ERROR_CODES.NOT_FOUND)
    } 

    const token = await genJWTToken({id: prismaUser.id, email: prismaUser.email});

    return {
      token: token,
      userId: prismaUser.id
    };
  }


  async signUp(payload: ISignUpRequest) {
    const isExist = await this.prismaService.user.findFirst({
      where: {
        email: payload.email
      }
    })

    if(isExist) {
      throw new BadRequestException(ERROR_CODES.USER_EXIST);
    }


    const salt = await bcrypt.genSaltSync(Number(config.saltRounds));
    payload.password = bcrypt.hashSync(payload.password, salt);

    const user = await this.prismaService.user.create({
      data: {
        email: payload.email,
        login: payload.login,
        password: payload.password,

      }
    })

    const token = await genJWTToken({id: user.id, email: user.email});

    return {
      token: token,
      userId: user.id
    }
  }

  async getMe(currentUser: User) {
    const prismaUser = await this.prismaService.user.findFirst({
      where: {
        id: currentUser.id
      },
    })


    console.log(prismaUser);

    return prismaUserToUser(prismaUser);
  }
}

