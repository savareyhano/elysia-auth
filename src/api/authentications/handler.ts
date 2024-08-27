import ClientError from '../../exceptions/client-error';
import ms from '../../utils/time-converter';

interface PostAuthenticationLoginHandler {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: {
    accessToken?: string;
  };
}

interface DeleteAuthenticationLogoutHandler {
  status: 'success' | 'fail' | 'error';
  message: string;
}

interface GetAuthenticationRefreshHandler {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: {
    newAccessToken?: string;
  };
}

class AuthenticationHandler {
  private _service: any;
  private _usersService: any;
  private _tokenManager: any;
  constructor(service: any, usersService: any, tokenManager: any) {
    this._service = service;
    this._usersService = usersService;
    this._tokenManager = tokenManager;

    this.postAuthenticationLoginHandler =
      this.postAuthenticationLoginHandler.bind(this);
    this.deleteAuthenticationLogoutHandler =
      this.deleteAuthenticationLogoutHandler.bind(this);
    this.getAuthenticationRefreshHandler =
      this.getAuthenticationRefreshHandler.bind(this);
  }

  async postAuthenticationLoginHandler(
    body: any,
    accessJwt: any,
    refreshJwt: any,
    jwt: any,
    set: any
  ): Promise<PostAuthenticationLoginHandler> {
    try {
      const { username, password } = body;

      const userId = await this._usersService.verifyUserCredential(
        username,
        password
      );

      const accessToken = await this._tokenManager.generateAccessToken(
        accessJwt,
        { id: userId }
      );
      const refreshToken = await this._tokenManager.generateRefreshToken(
        refreshJwt,
        { id: userId }
      );

      await this._service.addRefreshToken(refreshToken, userId);

      jwt.value = refreshToken;
      jwt.set({
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: ms(process.env.REFRESH_JWT_EXP!),
      });

      set.status = 201;
      return {
        status: 'success',
        message: 'Authentication added successfully.',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        set.status = error.statusCode;
        return {
          status: 'fail',
          message: error.message,
        };
      }

      // Server ERROR!
      set.status = 500;
      return {
        status: 'error',
        message: 'Sorry, there was a problem on our server.',
      };
    }
  }

  async deleteAuthenticationLogoutHandler(
    jwt: any,
    set: any
  ): Promise<DeleteAuthenticationLogoutHandler> {
    try {
      const refreshToken = jwt.value;

      const verifiedRefreshTokenInDB = await this._service.verifyRefreshToken(
        refreshToken
      );

      if (!verifiedRefreshTokenInDB) {
        jwt.remove();

        set.status = 404;
        return {
          status: 'fail',
          message: 'Token not found.',
        };
      }

      await this._service.removeRefreshToken(refreshToken);

      jwt.remove();

      set.status = 200;
      return {
        status: 'success',
        message: 'Token deleted successfully.',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        set.status = error.statusCode;
        return {
          status: 'fail',
          message: error.message,
        };
      }

      // Server ERROR!
      set.status = 500;
      return {
        status: 'error',
        message: 'Sorry, there was a problem on our server.',
      };
    }
  }

  async getAuthenticationRefreshHandler(
    accessJwt: any,
    refreshJwt: any,
    jwt: any,
    set: any
  ): Promise<GetAuthenticationRefreshHandler> {
    try {
      const refreshToken = jwt.value;

      jwt.remove();

      const verifiedRefreshTokenInDB = await this._service.verifyRefreshToken(
        refreshToken
      );

      // Reuse detection
      if (!verifiedRefreshTokenInDB) {
        const { id: userId } = await this._tokenManager.verifyRefreshToken(
          refreshJwt,
          refreshToken
        );
        await this._service.removeAllRefreshTokensByUserId(userId);

        set.status = 403;
        return {
          status: 'fail',
          message: 'Detected token reuse, please log in again.',
        };
      }

      await this._service.removeRefreshToken(refreshToken);

      const { id: userId } = await this._tokenManager.verifyRefreshToken(
        refreshJwt,
        refreshToken
      );

      const newAccessToken = await this._tokenManager.generateAccessToken(
        accessJwt,
        { id: userId }
      );
      const newRefreshToken = await this._tokenManager.generateRefreshToken(
        refreshJwt,
        { id: userId }
      );

      await this._service.addRefreshToken(newRefreshToken, userId);

      jwt.value = newRefreshToken;
      jwt.set({
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: ms(process.env.REFRESH_JWT_EXP!),
      });

      set.status = 200;
      return {
        status: 'success',
        message: 'Token refreshed successfully.',
        data: {
          newAccessToken,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        set.status = error.statusCode;
        return {
          status: 'fail',
          message: error.message,
        };
      }

      // Server ERROR!
      set.status = 500;
      return {
        status: 'error',
        message: 'Sorry, there was a problem on our server.',
      };
    }
  }
}

export default AuthenticationHandler;
