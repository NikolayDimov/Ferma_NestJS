import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsString,
  IsEnum,
} from "class-validator";
import { UserRole } from "./role.enum";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  password: string;

  @IsEnum(UserRole)
  role: UserRole = UserRole.VIEWER;
}
