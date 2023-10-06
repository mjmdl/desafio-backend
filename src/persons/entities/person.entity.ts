import { Order } from 'src/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

const ENTITY_NAME = 'pessoa';

@Entity({ name: ENTITY_NAME, schema: 'public' })
export class Person {
  static readonly NAME_MAX: number = 50;
  static readonly NAME_MIN: number = 3;
  static readonly CPF_LEN: number = 11;

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'nome', length: Person.NAME_MAX })
  name: string;

  @Column({ length: Person.CPF_LEN, unique: true })
  cpf: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Order, (order) => order.orderer)
  orders: Order[];

  constructor(name: string, cpf: string, admin?: boolean) {
    this.name = name;
    this.cpf = cpf;
    this.admin = admin;
  }
}
