import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";
import { Organization } from "./organization";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column()
  symbol!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  description!: string;

  @Column()
  eventDate!: Date;

  @Column()
  location!: string;

  @Column()
  banner!: string;

  @Column("jsonb", { nullable: true })
  media!: string;

  @Column("jsonb", { nullable: true })
  urls!: string;

  @Column({ nullable: true })
  contractAddress!: string;

  @Column()
  categoryId!: string;
  @ManyToOne((_type) => Category, (category: Category) => category.id)
  @JoinColumn({ name: "categoryId" })
  category!: Category;

  @Column({ nullable: true })
  totalSupply!: number;

  @Column()
  organizationId!: string;
  @ManyToOne((_type) => Organization, (organization: Organization) => organization.id)
  @JoinColumn({ name: "organizationId" })
  organization!: Organization;

  @Column({ default: false })
  isPublished!: boolean;

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
