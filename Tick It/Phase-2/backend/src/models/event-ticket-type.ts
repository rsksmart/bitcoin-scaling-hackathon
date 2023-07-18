import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Event } from "./event";

@Entity()
export class EventTicketType {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  eventId!: string;
  @ManyToOne((_type) => Event, (event: Event) => event.id)
  @JoinColumn({ name: "eventId" })
  event!: Event;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  supply!: number;

  @Column()
  price!: string;

  @Column({ nullable: true })
  ticketTypeId!: number;

  @Column({ nullable: true })
  image!: string;

  @Column({ default: false })
  isSoldout!: boolean;

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
