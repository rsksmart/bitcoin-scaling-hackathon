import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class PaymentType {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    createdBy!: string;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    updatedBy!: string;
}