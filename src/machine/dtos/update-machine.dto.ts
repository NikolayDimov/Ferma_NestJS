import { PartialType } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches, IsUUID } from "class-validator";
import { CreateMachineDto } from "./create-machine.dto";

export class UpdateMachineDto {
  @IsString()
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s\-]+$/, {
    message: "Name must contain only letters and numbers",
  })
  brand: string;
  @IsString()
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s\-]+$/, {
    message: "Name must contain only letters and numbers",
  })
  model: string;
  @IsString()
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s\-]+$/, {
    message: "Name must contain only letters and numbers",
  })
  registerNumber: string;
  @IsNotEmpty()
  @IsUUID()
  farmId: string;
}

// export class UpdateMachineDto extends Partial(CreateMachineDto) {

// }
