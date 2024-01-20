import { IsEmail, IsEnum, IsString, IsNotEmpty } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { UserRole } from "./role.enum";

export class UpdateUserDto extends CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole = UserRole.VIEWER;
}
