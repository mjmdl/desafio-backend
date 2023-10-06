import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderProduct } from './order-product.entity';
import { Person } from 'src/persons/entities/person.entity';

@Entity({ name: 'pedido', schema: 'public' })
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn({ name: 'data_cadastro' })
  dateCreated: Date;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderedProducts: OrderProduct[];

  @ManyToOne(() => Person, (person) => person.orders, { nullable: false })
  @JoinColumn({ name: 'id_pessoa' })
  orderer: Person;
}
