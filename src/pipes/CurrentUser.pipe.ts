// parse-token.pipe.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User,  } from '@prisma/client';
import { config } from 'src/config';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class CurrentUserPipe implements PipeTransform {
  constructor(private readonly prismaService: PrismaService) {}

  async transform(payload: { token: string }) {
    if (!payload.token) {
      return null;
    }

    const token = payload.token;

    try {
      const access_token = token.replace('Bearer ', '');
      const jwtUser = await jwt.verify(access_token, config.jwt.secret);

      try {
        const user = await this.prismaService.user.findUniqueOrThrow({
          where: {
            id: jwtUser.id,
          },

          
        });

      
        if(!user) {
          throw new HttpException('', HttpStatus.UNAUTHORIZED);
        }

        return user as User;
      } catch (e) {
        throw new HttpException('', HttpStatus.UNAUTHORIZED);
      }
    } catch (e) {
      throw new HttpException('', HttpStatus.UNAUTHORIZED);
    }
  }
}
