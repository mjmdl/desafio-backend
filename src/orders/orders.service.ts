import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { PersonsService } from 'src/persons/persons.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from 'src/products/products.service';
import { OrderView } from './entities/order.view';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(OrderProduct)
    private readonly orderProductsRepository: Repository<OrderProduct>,

    @InjectRepository(OrderView)
    private readonly orderViewsRepository: Repository<OrderView>,

    private readonly personsService: PersonsService,
    private readonly productsService: ProductsService,
  ) {}

  async create(creation: CreateOrderDto): Promise<void> {
    let newOrder = new Order();
    newOrder.orderer = await this.personsService.find({
      cpf: creation.customerCpf,
    });

    try {
      newOrder = await this.ordersRepository.save(newOrder);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao registrar pedido.',
      });
    }

    let newOrderProducts = new Array<OrderProduct>();
    for (const orderProduct of creation.orderProducts) {
      const product = await this.productsService.find({ id: orderProduct.id });
      const newOrderProduct = new OrderProduct();

      newOrderProduct.product = product;
      newOrderProduct.order = newOrder;
      newOrderProduct.quantity = orderProduct.quantity;
      newOrderProduct.totalValue = orderProduct.quantity * product.value;

      newOrderProducts.push(newOrderProduct);
    }

    try {
      await this.orderProductsRepository.insert(newOrderProducts);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao associar produto ao pedido.',
      });
    }
  }

  async findViewPage(
    page: number,
    where?: Partial<OrderView>,
  ): Promise<OrderView[]> {
    const ORDERS_PER_PAGE = 100;

    let views: OrderView[];
    try {
      views = await this.orderViewsRepository.find({
        where,
        skip: page * ORDERS_PER_PAGE,
        take: ORDERS_PER_PAGE,
      });
    } catch (error) {}

    if (!views || views.length === 0) {
      throw new NotFoundException({
        message: 'Nenhum pedido encontrado.',
      });
    }

    return views;
  }
}
