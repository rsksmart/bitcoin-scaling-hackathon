import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrganizationMember } from "./organization-member";
import { Event } from "./event";

@Entity()
export class EventMember {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    memberId!: string;
    @ManyToOne((_type) => OrganizationMember, (member: OrganizationMember) => member.id)
    @JoinColumn({ name: "memberId" })
    member!: OrganizationMember;

    @Column()
    eventId!: string;
    @ManyToOne((_type) => Event, (event: Event) => event.id)
    @JoinColumn({ name: "eventId" })
    event!: Event;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    createdBy!: string;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    updatedBy!: string;
}
