import ConflictError from '../exceptions/conflict-error';
import InvariantError from '../exceptions/invariant-error';
import NotFoundError from '../exceptions/not-found-error';

class UsersService {
  _prisma: any;
  constructor(prisma: any) {
    this._prisma = prisma;
  }

  async verifyNewUser(username: string) {
    const user = await this._prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
      },
    });

    if (user) {
      throw new ConflictError('user already exists.');
    }

    return user;
  }

  async verifyUser(username: string) {
    const user = await this._prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundError('user does not exist.');
    }

    return user;
  }

  async addUser(username: string, password: string) {
    const hashedPassword = await Bun.password.hash(password);

    const user = await this._prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      throw new InvariantError('failed to add user.');
    }

    return user;
  }
}

export default UsersService;
