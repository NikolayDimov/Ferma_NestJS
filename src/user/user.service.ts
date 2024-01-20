import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserRole } from "../auth/dtos/role.enum";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(email: string, password: string, role: UserRole) {
    const user = this.userRepository.create({
      email,
      password,
      role,
    });

    return this.userRepository.save(user).then((createdUser) => {
      // Return a simplified version of the user without the password
      const { id, email, role, created, updated, deleted } = createdUser;
      return { id, email, role, created, updated, deleted };
    });
  }

  async findOne(email: string): Promise<User | undefined> {
    // return this.userRepository.findOne({ where: { username } });
    return await this.userRepository.findOneBy({ email });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async find(email: string) {
    return this.userRepository.find({ where: { email } });
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
