import { config } from 'src/config';
import * as jwt from 'jsonwebtoken';

export const genJWTToken = async (object: any): Promise<string> => {
  const token = await jwt.sign(object, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  return token;
};

