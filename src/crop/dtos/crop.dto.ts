import { Expose } from "class-transformer";
import { IsUUID, IsString } from "class-validator";

export class CropDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  name: string;
}
