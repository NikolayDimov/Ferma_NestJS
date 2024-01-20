import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { UserRole } from "../auth/dtos/role.enum";

@Entity({ name: "user", schema: "public" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.VIEWER,
    enumName: "user_role",
  })
  role: UserRole;

  // Not connect user and farm
  // @OneToMany(() => Farm, (farm) => farm.user)
  // farms: Farm[];

  @AfterInsert()
  logInsert() {
    console.log("Inserted User with id", this.id, "and role", this.role);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("Updated User with id", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("Removed User with id", this.id);
  }

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
