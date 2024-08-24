import InvariantError from '../../exceptions/invariant-error';
import prisma from '../../libs/db';
import ms from '../../utils/time-converter';

class AuthenticationsService {
  private _prisma: typeof prisma;
  constructor() {
    this._prisma = prisma;
  }

  async verifyRefreshToken(refreshToken: string): Promise<Boolean> {
    const foundRefreshToken = await this._prisma.authentication.findUnique({
      where: {
        token: refreshToken,
      },
      select: {
        token: true,
      },
    });

    // Returns true or false
    return !!foundRefreshToken;
  }

  async removeAllRefreshTokensByUserId(userId: string): Promise<void> {
    await this._prisma.authentication.deleteMany({
      where: {
        userId,
      },
    });
  }

  async removeRefreshToken(refreshToken: string): Promise<void> {
    await this._prisma.authentication.delete({
      where: {
        token: refreshToken,
      },
    });
  }

  async removeExpiredRefreshTokens(): Promise<void> {
    const date = new Date().toISOString();

    await this._prisma.authentication.deleteMany({
      where: {
        expiresAt: {
          lt: date, // delete all tokens that are lower (lt) than the current
                    // date
        },
      },
    });
  }

  async addRefreshToken(refreshToken: string, userId: string): Promise<void> {
    const expire = new Date(
      Date.now() + ms(process.env.REFRESH_JWT_EXP!)
    ).toISOString();

    const createdRefreshToken = await this._prisma.authentication.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: expire,
      },
      select: {
        token: true,
      },
    });

    if (!createdRefreshToken) {
      throw new InvariantError('Failed to add refresh token.');
    }
  }
}

export default AuthenticationsService;
