import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { Machine } from "../machine/machine.entity";
import { GrowingCropPeriod } from "../growing-crop-period/growing-crop-period.entity";
import { ProcessingType } from "../processing-type/processing-type.entity";
import { IsDateString } from "class-validator";

@Entity()
export class Processing {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "date" })
  @IsDateString()
  date: Date;

  @ManyToOne(
    () => GrowingCropPeriod,
    (growingCropPeriod) => growingCropPeriod.processings,
    { nullable: false },
  )
  @JoinColumn({ name: "growing_crop_period_id" })
  growingCropPeriod: GrowingCropPeriod;

  @ManyToOne(
    () => ProcessingType,
    (processingType) => processingType.processings,
    { nullable: false },
  )
  @JoinColumn({ name: "cultivation_type_id" })
  processingType: ProcessingType;

  @ManyToOne(() => Machine, (machine) => machine.processings, {
    nullable: false,
  })
  @JoinColumn({ name: "machine_id" })
  machine: Machine;

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
