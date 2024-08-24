import ClientError from '../../exceptions/client-error';

interface PostUserHandler {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: {
    userId?: string;
  };
}

class UsersHandler {
  private _service: any;
  constructor(service: any) {
    this._service = service;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(body: any, set: any): Promise<PostUserHandler> {
    try {
      const { username, password, fullname } = body;

      await this._service.verifyNewUsername(username);

      const userId = await this._service.addUser(username, password, fullname);

      set.status = 201;
      return {
        status: 'success',
        message: 'User added successfully.',
        data: {
          userId,
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
      console.log(error)
      // Server ERROR!
      set.status = 500;
      return {
        status: 'error',
        message: 'Sorry, there was a problem on our server.',
      };
    }
  }
}

export default UsersHandler;
