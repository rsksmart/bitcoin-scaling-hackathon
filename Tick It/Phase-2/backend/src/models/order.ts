import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { Event } from "./event";
import { PaymentType } from "./payment-type";

@Entity()
export class Order {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    paymentTypeId!: string;
    @ManyToOne((_type) => PaymentType, (paymentType: PaymentType) => paymentType.id)
    @JoinColumn({ name: "paymentTypeId" })
    paymentType!: PaymentType;

    @Column()
    userId!: string;
    @ManyToOne((_type) => User, (user: User) => user.id)
    @JoinColumn({ name: "userId" })
    user!: User;

    @Column()
    eventId!: string;
    @ManyToOne((_type) => Event, (event: Event) => event.id)
    @JoinColumn({ name: "eventId" })
    event!: Event;

    @Column()
    totalAmount!: number

    @Column("jsonb")
    details!: string

    @Column({default: "pending"})
    status!: string

    @Column("jsonb")
    responseMessage!: string

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    createdBy!: string;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    updatedBy!: string;
}
