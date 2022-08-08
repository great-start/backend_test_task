import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { RolesEnum } from './roles.enum';
import { Token } from './token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @CreateDateColumn({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.USER })
  role: RolesEnum;

  @ManyToOne(() => User, (user) => user.subordinates, { nullable: true })
  boss: User;

  @OneToMany(() => User, (user) => user.boss)
  subordinates: User[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
