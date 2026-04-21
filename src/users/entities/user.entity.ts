import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: 'varchar', length: 60 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 100 })
  password!: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
