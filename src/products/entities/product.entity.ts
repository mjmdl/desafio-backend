import { OrderProduct } from 'src/orders/entities/order-product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'produto', schema: 'public' })
export class Product {
  static readonly NAME_MAX: number = 50;
  static readonly NAME_MIN: number = 3;
  static readonly DESCRIPTION_MAX: number = 10000;

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'valor', type: 'decimal', precision: 6, scale: 2 })
  value: number;

  @Column({ name: 'nome', length: Product.NAME_MAX })
  name: string;

  @Column({ name: 'favorito', default: false })
  favorite: boolean;

  @Column({ name: 'descricao', type: 'varchar' })
  description: string;

  @CreateDateColumn({ name: 'data_cadastro' })
  dateCreated: Date;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];
}
