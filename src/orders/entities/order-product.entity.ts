import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity({ name: 'pedidos_produtos', schema: 'public' })
export class OrderProduct {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'quantidade' })
  quantity: number;

  @Column({ name: 'valor_total', type: 'decimal', precision: 7, scale: 2 })
  totalValue: number;

  @ManyToOne(() => Order, (order) => order.orderedProducts, { nullable: false })
  @JoinColumn({ name: 'id_pedido' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderProducts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_produto' })
  product: Product;
}
