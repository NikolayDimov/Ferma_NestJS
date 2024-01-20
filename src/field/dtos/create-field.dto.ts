import {
  IsNotEmpty,
  IsString,
  Matches,
  IsObject,
  IsUUID,
} from "class-validator";
import { MultiPolygon, Polygon } from "geojson";

export class CreateFieldDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  name: string;

  @IsNotEmpty({ message: "Polygons cannot be empty" })
  @IsObject({ message: "Polygons must be a valid GeoJSON object" })
  boundary: MultiPolygon | Polygon;

  @IsNotEmpty({ message: "SoilId cannot be empty" })
  @IsUUID("4", { message: "Invalid SoilId" })
  soilId: string;

  @IsNotEmpty({ message: "FarmId cannot be empty" })
  @IsUUID("4", { message: "Invalid FarmId" })
  farmId: string;
}
