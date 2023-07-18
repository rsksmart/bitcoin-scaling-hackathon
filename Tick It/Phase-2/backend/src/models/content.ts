import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Content {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    contentName!: string;

    @Column()
    contentType!: number;

    @Column("jsonb",{nullable: true})
    contentJson!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    createdBy!: string;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    updatedBy!: string;
}
