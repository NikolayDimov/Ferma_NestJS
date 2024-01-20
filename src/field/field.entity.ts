import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { MultiPolygon, Polygon } from "geojson";
import { Farm } from "../farm/farm.entity";
import { Soil } from "../soil/soil.entity";
import { GrowingCropPeriod } from "../growing-crop-period/growing-crop-period.entity";

@Entity()
export class Field {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ type: "jsonb", nullable: false })
  boundary: MultiPolygon | Polygon;

  @ManyToOne(() => Farm, (farm) => farm.fields, { nullable: false })
  @JoinColumn({ name: "farm_id" })
  farm: Farm;

  // If there is two-way connection between field and soil
  // soil_id is in filed table
  // but also from soil table can reach many fields
  @ManyToOne(() => Soil, (soil) => soil.fields, { nullable: false })
  @JoinColumn({ name: "soil_id" })
  soil: Soil;

  // If there is one-way connection between field and soil
  // soil_id is in filed table
  // @ManyToOne(() => Soil, (soil) => soil.id)
  // @JoinColumn({ name: "soil_id" })
  // soil: Field;

  // When get all fields wants growingCropPeriods
  @OneToMany(
    () => GrowingCropPeriod,
    (growingCropPeriod) => growingCropPeriod.field,
  )
  growingCropPeriods: GrowingCropPeriod[];

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  created: Date;

  @UpdateDateColumn({
    type: "timestamp",
    onUpdate: "CURRENT_TIMESTAMP",
    name: "updated_at",
  })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", name: "deleted_at", nullable: true })
  deleted: Date;
}
