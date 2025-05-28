import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, BaseUserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '@common/types/user-document';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<BaseUserDocument>,
  ) {}

  async create(userData: CreateUserDto): Promise<BaseUserDocument> {
    const existingUser = await this.findOneByEmail(userData.email);
    if (existingUser) {
      throw new Error('Account exist.');
    }
    const { password, ...userDetails } = userData;
    const salt = await bcrypt.genSalt(10);
    const updatedPasssword = await bcrypt.hash(password, salt);
    const user = { ...userDetails, password: updatedPasssword };
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll(): Promise<BaseUserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).lean<UserDocument>().exec();
  }
}
