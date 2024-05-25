import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const exists = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (exists) {
      throw new BadRequestException(
        `User with username ${createUserDto.username} or email ${createUserDto.email} already exists`,
      );
    }
    const newUser = this.userRepository.create(createUserDto);
    const createdUser = await this.userRepository.save(newUser);
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const exists = await this.userRepository.findOne({
      where: [{ id }],
    });

    if (!exists) {
      throw new BadRequestException(`User with id ${id} does not exists`);
    }
    return exists;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ id }],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.userRepository.merge(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const removed = await this.userRepository.delete(id);
    return removed.affected > 0;
  }
}
