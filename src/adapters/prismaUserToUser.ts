import { User } from "@prisma/client";
import { IUser } from "../dto/base/IUser";

export const prismaUserToUser = (user: User): IUser => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
  }
}