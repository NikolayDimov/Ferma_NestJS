import { Expose } from "class-transformer";

export class ProcessingTypeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
