import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum StatusType {
    PENDING = "pending",
    EXPIRED = "expired",
    ERRORED = "errored",
    COMPLETED = "completed"
}

@Entity()
export class PasswordRecovery {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    email!: string;

    @Column()
    token!: string;

    @Column({
        type: "enum",
        enum: StatusType,
        default: StatusType.PENDING,
    })
    status!: StatusType;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    createdBy!: string;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    updatedBy!: string;
}
