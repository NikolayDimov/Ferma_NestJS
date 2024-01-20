import { IsNotEmpty, IsString, Matches, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class LocationDto {
  @IsNotEmpty({ message: "Location cannot be empty" })
  @Type(() => Number)
  coordinates: [number, number];
}

export class UpdateFarmDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  name: string;

  @IsNotEmpty({ message: "Location cannot be empty" })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
