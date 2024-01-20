import { IsNotEmpty, IsDateString, IsUUID } from "class-validator";

export class CreateProcessingDto {
  @IsNotEmpty({ message: "Date cannot be empty" })
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsUUID()
  growingCropPeriodId: string;

  @IsNotEmpty()
  @IsUUID()
  processingTypeId: string;

  @IsNotEmpty()
  @IsUUID()
  machineId: string;
}
