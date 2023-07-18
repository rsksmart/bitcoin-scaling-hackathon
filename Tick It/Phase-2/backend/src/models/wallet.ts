import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";

export enum WalletType {
    PRIVATE = "private",
    CUSTODIAL = "custodial"
}

@Entity()
export class Wallet {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    userId!: string;
    @ManyToOne((_type) => User, (user: User) => user.id)
    @JoinColumn({ name: "userId" })
    user!: User;

    @Column({unique: true})
    address!: string;

    @Column({
        type: "enum",
        enum: WalletType,
        default: WalletType.PRIVATE,
    })
    type!: WalletType;

    @Column({ nullable: true })
    phrase!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    createdBy!: string;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    updatedBy!: string;
}
