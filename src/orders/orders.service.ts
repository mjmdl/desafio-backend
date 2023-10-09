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
import { Person } from 'src/persons/entities/person.entity';
import { Product } from 'src/products/entities/product.entity';
import { PersonOrderView } from './entities/person.order.view';

// Padrão e máximo de pedidos selecionados por SELECT.
const ORDERS_PER_PAGE = 20;

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(OrderProduct)
    private readonly orderProductsRepository: Repository<OrderProduct>,

    @InjectRepository(PersonOrderView)
    private readonly personOrderViewsRepository: Repository<PersonOrderView>,

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
    try {
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

      await this.orderProductsRepository.insert(newOrderProducts);
    } catch (error) {
      console.error(error);

      try {
        await this.ordersRepository.delete({ id: newOrder.id });
      } catch (error) {
        console.error(error);
      }

      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          message: 'Falha ao criar pedido.',
        });
      }
    }
  }

  async findPersonPage(
    personCpf: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PersonOrderView[]> {
    if (pageSize > ORDERS_PER_PAGE || pageSize < 1) {
      pageSize = ORDERS_PER_PAGE;
    }

    let personOrders: PersonOrderView[];
    try {
      personOrders = await this.personOrderViewsRepository.find({
        where: { cpf: personCpf },
        skip: pageNumber * pageSize,
        take: pageSize,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar pedidos.',
      });
    }

    if (!personOrders) {
      throw new NotFoundException({
        message: 'Nenhum pedido encontrado.',
      });
    }

    return personOrders;
  }

  async findPageOfPerson<T>(
    entityClass: EntityTarget<T>,
    personCpf: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<T> {
    if (pageSize > ORDERS_PER_PAGE || pageSize < 1) {
      pageSize = ORDERS_PER_PAGE;
    }

    let entities: T;
    try {
      const { tableName } =
        this.entityManager.getRepository(entityClass).metadata;

      entities = await this.entityManager.query(`
        SELECT
          *
        FROM
          ${tableName} AS target
        WHERE
          target.id IN (
            SELECT
              pedido.id
            FROM
              pedido
            INNER JOIN
              pessoa ON pessoa.cpf = CAST(${personCpf} AS VARCHAR)
            WHERE
              pedido.id_pessoa = pessoa.id
          )
        OFFSET
          ${pageNumber * pageSize}
        LIMIT
          ${pageSize}
      `);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar pedidos de pessoa.',
      });
    }

    if (!entities) {
      throw new NotFoundException({
        message: 'Nenhum pedido encontrado.',
      });
    }

    return entities;
  }

  async findPage<T>(
    entityClass: EntityTarget<T>,
    pageNumber: number,
    pageSize: number = ORDERS_PER_PAGE,
    where?: Partial<T>,
  ): Promise<T[]> {
    if (pageSize > ORDERS_PER_PAGE || pageSize < 1) {
      pageSize = ORDERS_PER_PAGE;
    }

    let entities: T[];
    try {
      entities = await this.entityManager.find(entityClass, {
        where: where as FindOptionsWhere<T>,
        skip: pageNumber * pageSize,
        take: pageSize,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar pedidos.',
      });
    }

    if (!entities || entities.length === 0) {
      throw new NotFoundException({
        message: 'Nenhum pedido encontrado.',
      });
    }

    return entities;
  }
}
