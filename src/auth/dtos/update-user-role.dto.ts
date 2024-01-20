import { UserRole } from "./role.enum";
import { IsNotEmpty, IsEnum } from "class-validator";

export class UpdateUserRoleDto {
  @IsNotEmpty()
  userId: string;

  @IsEnum(UserRole)
  newRole: UserRole;
}
