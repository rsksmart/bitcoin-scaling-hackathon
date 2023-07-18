import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Setting {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column("jsonb")
    details!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    createdBy!: string;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    updatedBy!: string;
}
