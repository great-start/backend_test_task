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

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @CreateDateColumn({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.USER })
  role: RolesEnum;

  @OneToMany(() => User, (user) => user.subordinates, { nullable: true })
  boss: User;

  @ManyToOne(() => User, (user) => user.boss, { nullable: true })
  subordinates: User[];

  @OneToMany(() => Token, (token) => token.user, { nullable: true })
  tokens: Token[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
