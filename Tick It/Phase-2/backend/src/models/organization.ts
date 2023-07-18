import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  ownerId!: string;
  @ManyToOne((_type) => User, (owner: User) => owner.id)
  @JoinColumn({ name: "ownerId" })
  owner!: User;

  @Column()
  name!: string;

  @Column()
  profile!: string;

  @Column()
  banner!: string;

  @Column("jsonb", { nullable: true })
  vettingObj!: string;

  @Column({ default: true })
  isVetted!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  updatedBy!: string;
}
