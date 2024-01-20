import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from "typeorm";
import { Field } from "../field/field.entity";
import { Machine } from "../machine/machine.entity";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  // @Column({ type: "point" })
  // location: string;

  @Column({ type: "jsonb", nullable: false })
  location: { type: string; coordinates: number[] };

  @OneToMany(() => Machine, (machine) => machine.farm)
  machines: Machine[];

  @OneToMany(() => Field, (field) => field.farm)
  fields: Field[];

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
