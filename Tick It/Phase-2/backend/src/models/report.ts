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
import { Event } from "./event";
import { ReportType } from "./report-type";
import { Organization } from "./organization";

@Entity()
export class Report {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;
  @ManyToOne((_type) => User, (user: User) => user.id)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  reportTypeId!: string;
  @ManyToOne((_type) => ReportType, (reportType: ReportType) => reportType.id)
  @JoinColumn({ name: "reportTypeId" })
  reportType!: ReportType;

  @Column({ nullable: true })
  eventId!: string;
  @ManyToOne((_type) => Event, (event: Event) => event.id)
  @JoinColumn({ name: "eventId" })
  event!: Event;

  @Column({ nullable: true })
  organizationId!: string;
  @ManyToOne((_type) => Organization, (organization: Organization) => organization.id)
  @JoinColumn({ name: "organizationId" })
  organization!: Organization;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: "pending" })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  updatedBy!: string;
}
