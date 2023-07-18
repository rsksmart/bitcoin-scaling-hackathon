import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, nullable: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Column({ unique: true, nullable: true })
  googleId!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ nullable: true })
  phoneNumber!: string;

  @Column({ default: false })
  isOAuth!: boolean;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isActivated!: boolean;

  @Column("jsonb", { nullable: true })
  notifications!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  updatedBy!: string;
}
