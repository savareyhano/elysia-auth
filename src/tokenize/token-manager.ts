import type { JWTPayloadSpec } from '@elysiajs/jwt';
import InvariantError from '../exceptions/invariant-error';

interface TokenManager {
  generateAccessToken(accessJwt: any, payload: object): Promise<string>;
  generateRefreshToken(refreshJwt: any, payload: object): Promise<string>;
  verifyRefreshToken(refreshJwt: any, token: string): Promise<JWTPayloadSpec>;
}

const tokenManager: TokenManager = {
  generateAccessToken: async (
    accessJwt: any,
    payload: object
  ): Promise<string> => {
    try {
      return await accessJwt.sign(payload);
    } catch (error) {
      throw new InvariantError('Failed to generate access token.');
    }
  },
  generateRefreshToken: async (
    refreshJwt: any,
    payload: object
  ): Promise<string> => {
    try {
      return await refreshJwt.sign(payload);
    } catch (error) {
      throw new InvariantError('Failed to generate refresh token.');
    }
  },
  verifyRefreshToken: async (
    refreshJwt: any,
    token: string
  ): Promise<JWTPayloadSpec> => {
    const verifiedRefreshToken = await refreshJwt.verify(token);

    if (!verifiedRefreshToken) {
      throw new InvariantError('Invalid refresh token.');
    }

    return verifiedRefreshToken;
  },
};

export default tokenManager;
