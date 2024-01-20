import { Expose } from "class-transformer";
import { IsUUID, IsString } from "class-validator";

export class MachineDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  brand: string;

  @Expose()
  @IsString()
  model: string;

  @Expose()
  @IsString()
  registerNumber: string;
}
