import { IsString, IsNotEmpty, Matches, MinLength } from "class-validator";

export class UpdateSoilDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  @MinLength(3)
  name: string;
}
