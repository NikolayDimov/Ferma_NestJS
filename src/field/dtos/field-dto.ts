import { Expose, Type } from "class-transformer";
import { FarmDto } from "../../farm/dtos/farm.dto";
import { SoilDto } from "../../soil/dtos/soil.dto";

export class FieldDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  boundary: string;

  @Expose()
  @Type(() => FarmDto)
  farm: FarmDto;

  @Expose()
  @Type(() => SoilDto)
  soil: SoilDto;
}
