import InvariantError from '../../exceptions/invariant-error';
import prisma from '../../libs/db';
import { nanoid } from 'nanoid';

class UsersService {
  private _prisma: typeof prisma;
  constructor() {
    this._prisma = prisma;
  }

  async verifyNewUsername(username: string): Promise<void> {
    const foundUsername = await this._prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
      },
    });

    if (foundUsername) {
      throw new InvariantError('Username already exists.');
    }
  }

  async addUser(
    username: string,
    password: string,
    fullname: string
  ): Promise<string> {
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    const createdUser = await this._prisma.user.create({
      data: {
        id,
        username,
        password: hashedPassword,
        fullname,
      },
      select: {
        id: true,
      },
    });

    if (!createdUser) {
      throw new InvariantError('Failed to add user.');
    }

    return createdUser.id;
  }

  async verifyUserCredential(
    username: string,
    password: string
  ): Promise<string> {
    const foundUser = await this._prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!foundUser) {
      throw new InvariantError('Invalid credentials.');
    }

    const verifiedPassword = await Bun.password.verify(
      password,
      foundUser.password
    );

    if (!verifiedPassword) {
      throw new InvariantError('Invalid credentials.');
    }

    return foundUser.id;
  }
}

export default UsersService;
