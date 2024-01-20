import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Crop } from "../crop/crop.entity";
import { Field } from "../field/field.entity";
import { Processing } from "../processing/processing.entity";

@Entity()
export class GrowingCropPeriod {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Field, (field) => field.growingCropPeriods, {
    nullable: false,
  })
  @JoinColumn({ name: "field_id" })
  field: Field;

  @ManyToOne(() => Crop, (crop) => crop.growingCropPeriods, { nullable: false })
  @JoinColumn({ name: "crop_id" })
  crop: Crop;

  @OneToMany(() => Processing, (processing) => processing.growingCropPeriod)
  processings: Processing[];

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
