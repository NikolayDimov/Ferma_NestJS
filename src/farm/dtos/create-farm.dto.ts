import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class LocationDto {
  @IsNotEmpty({ message: "Location cannot be empty" })
  @Type(() => Number)
  coordinates: [number, number];
}

export class CreateFarmDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  name: string;

  @IsNotEmpty({ message: "Location cannot be empty" })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
