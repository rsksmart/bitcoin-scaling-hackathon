import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MemberRole } from "./member-role";
import { Organization } from "./organization";
import { User } from "./user";

@Entity()
export class Invitation {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    senderId!: string;
    @ManyToOne((_type) => User, (sender: User) => sender.id)
    @JoinColumn({ name: "senderId" })
    sender!: User;

    @Column()
    organizationId!: string;
    @ManyToOne((_type) => Organization, (organization: Organization) => organization.id)
    @JoinColumn({ name: "organizationId" })
    organization!: Organization;

    @Column()
    email!: string;

    @Column()
    memberRoleId!: string;
    @ManyToOne((_type) => MemberRole, (memberRole: MemberRole) => memberRole.id)
    @JoinColumn({ name: "memberRoleId" })
    memberRole!: MemberRole;

    @Column()
    receiverId!: string;
    @ManyToOne((_type) => User, (receiver: User) => receiver.id)
    @JoinColumn({ name: "receiverId" })
    receiver!: User;

    @Column()
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
