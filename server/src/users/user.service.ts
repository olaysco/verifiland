import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashService } from './hash.service';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private hashService: HashService,
  ) {}

  async getUserByUsername(username: string) {
    return await this.userModel
      .findOne({
        username,
      })
      .exec();
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel
      .findOne({
        email,
      })
      .exec();
    return user;
  }

  async getUserByPublicAddress(publicAddress: string) {
    if (!publicAddress) {
      return;
    }
    const user = await this.userModel
      .findOne({
        publicAddress,
      })
      .select('-role')
      .select('-password')
      .select('-_id')
      .exec();

    if (user) {
      return user;
    }

    throw new NotFoundException('User with the public address does not exist');
  }

  async registerUser(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    const user = await this.getUserByEmail(createUser.email);
    if (user) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'User with the email already exists.',
      });
    }
    createUser.password = await this.hashService.hashPassword(
      createUser.password,
    );

    return createUser.save();
  }

  async getUsersAddress() {
    const allUsers = await this.getAllUsers();
    const result = [];
    allUsers.forEach((user) => {
      result.push({
        publicAdress: user.publicAddress,
        fullname: user.fullname,
      });
    });

    return result;
  }

  async getAllUsers() {
    return this.userModel.find({}).exec();
  }
}
