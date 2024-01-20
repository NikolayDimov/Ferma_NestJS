import { IsNotEmpty, IsDateString, IsUUID } from "class-validator";

export class UpdateProcessingDto {
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
