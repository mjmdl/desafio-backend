import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import {
  EntityManager,
  EntityTarget,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { PersonsService } from 'src/persons/persons.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from 'src/products/products.service';
import { OrderView } from './entities/order.view';
import { Person } from 'src/persons/entities/person.entity';
import { Product } from 'src/products/entities/product.entity';

// Padrão e máximo de pedidos selecionados por SELECT.
const ORDERS_PER_PAGE = 20;

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(OrderProduct)
    private readonly orderProductsRepository: Repository<OrderProduct>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,

    private readonly personsService: PersonsService,
    private readonly productsService: ProductsService,
  ) {}

  async create(creation: CreateOrderDto): Promise<void> {
    // Verifica quantidade de produtos.
    if (creation.orderProducts.length === 0) {
      throw new BadRequestException({
        message: 'Ao menos um produto é necessário para abrir o pedido.',
      });
    }

    // Cria pedido.
    let newOrder = new Order();
    newOrder.orderer = await this.personsService.find(Person, {
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

    // Cria pedidos de produtos.
    let newOrderProducts = new Array<OrderProduct>();
    for (const ordProd of creation.orderProducts) {
      const prod = await this.productsService.find(Product, {
        id: ordProd.id,
      });

      const newOrdProd = new OrderProduct();
      newOrdProd.product = prod;
      newOrdProd.order = newOrder;
      newOrdProd.quantity = ordProd.quantity;
      newOrdProd.totalValue = ordProd.quantity * prod.value;

      newOrderProducts.push(newOrdProd);
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

  async findPage<T>(
    entityClass: EntityTarget<T>,
    page: number,
    pageSize: number = ORDERS_PER_PAGE,
    where?: Partial<T>,
  ): Promise<T[]> {
    if (pageSize > ORDERS_PER_PAGE) {
      pageSize = ORDERS_PER_PAGE;
    }

    let views: T[];
    try {
      views = await this.entityManager.find(entityClass, {
        where: where as FindOptionsWhere<T>,
        skip: page * pageSize,
        take: pageSize,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Falha ao buscar pedidos.',
      });
    }

    if (!views || views.length === 0) {
      throw new NotFoundException({
        message: 'Nenhum pedido encontrado.',
      });
    }

    return views;
  }
}
