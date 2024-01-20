import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateGrowingCropPeriodDto {
  @IsNotEmpty({ message: "FarmId cannot be empty" })
  @IsUUID("4", { message: "Invalid FarmId" })
  fieldId: string;

  @IsNotEmpty({ message: "CropId cannot be empty" })
  @IsUUID("4", { message: "Invalid CropId" })
  cropId: string;
}
