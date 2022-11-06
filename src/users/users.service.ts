import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { PrismaService } from '../database/prisma.service';
import { UserModel } from '@prisma/client';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
  ) {}
  async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(email, name);
    const salt = this.configService.get('SALT');
    await newUser.setPassword(password, Number(salt));
    const existedUser = await this.usersRepository.find(email);
    if (existedUser) {
      return null;
    }
    return await this.usersRepository.create(newUser);
  }
  async validateUser(dto: UserLoginDto): Promise<boolean> {
    const existedUser = await this.usersRepository.find(dto.email);
    if (!existedUser) {
      return false;
    }
    const { email, password, name } = existedUser;
    const currentUser = new User(email, name, password);
    const validateResult = await currentUser.comparePassword(dto.password);
    return validateResult;
  }
}
