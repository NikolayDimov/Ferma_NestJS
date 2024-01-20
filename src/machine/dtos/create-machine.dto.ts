import { IsString, IsNotEmpty, Matches, IsUUID } from "class-validator";

export class CreateMachineDto {
  @IsNotEmpty({ message: "Brand cannot be empty" })
  @IsString({ message: "Brand must be a string" })
  @Matches(/^[A-Za-z0-9\s\-]+$/, {
    message: "Brand must contain only letters and numbers",
  })
  brand: string;

  @IsNotEmpty({ message: "Model cannot be empty" })
  @IsString({ message: "Model must be a string" })
  @Matches(/^[A-Za-z0-9\s\-]+$/, {
    message: "Model must contain only letters and numbers",
  })
  model: string;

  @IsNotEmpty({ message: "Register Number cannot be empty" })
  @IsString({ message: "Register Number must be a string" })
  @Matches(/^[A-Za-z0-9\s\-]+$/, {
    message: "Register Number must contain only letters and numbers",
  })
  registerNumber: string;

  @IsNotEmpty()
  @IsUUID()
  farmId: string;
}
