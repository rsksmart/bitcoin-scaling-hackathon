import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AdminRole } from "./admin-role";

@Entity()
export class Admin {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string

    @Column()
    adminRoleId!: string;
    @ManyToOne((_type) => AdminRole, (adminRole: AdminRole) => adminRole.id)
    @JoinColumn({ name: "adminRoleId" })
    adminRole!: AdminRole;

    @Column({nullable: true})
    address!: string

    @Column({nullable: true})
    email!: string

    @Column({nullable: true})
    password!: string

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    createdBy!: string;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    updatedBy!: string;
}
