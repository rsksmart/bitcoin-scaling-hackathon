import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MemberRole } from "./member-role";
import { Organization } from "./organization";
import { User } from "./user";

@Entity()
export class OrganizationMember {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    memberRoleId!: string;
    @ManyToOne((_type) => MemberRole, (role: MemberRole) => role.id)
    @JoinColumn({ name: "memberRoleId" })
    memberRole!: MemberRole;

    @Column()
    userId!: string;
    @ManyToOne((_type) => User, (user: User) => user.id)
    @JoinColumn({ name: "userId" })
    user!: User;

    @Column()
    organizationId!: string;
    @ManyToOne((_type) => Organization, (organization: Organization) => organization.id)
    @JoinColumn({ name: "organizationId" })
    organization!: Organization;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    createdBy!: string;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    updatedBy!: string;
}
