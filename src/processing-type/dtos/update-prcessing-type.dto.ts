import { IsString, IsNotEmpty, Matches } from "class-validator";

export class UpdateProcessingTypeDto {
  @IsString()
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s\-]+$/, {
    message: "Name must contain only letters and numbers",
  })
  name: string;
}
