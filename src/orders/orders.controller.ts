import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderView } from './entities/order.view';
import { AuthPersonDto } from 'src/persons/dto/auth-person.dto';
import { PersonsService } from 'src/persons/persons.service';
import { PersonOrderView } from './entities/person.order.view';

@Controller('pedidos')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly personsService: PersonsService,
  ) {}

  @Post()
  async create(@Body() creation: CreateOrderDto): Promise<void> {
    await this.ordersService.create(creation);
  }

  @Post(['id=:id'])
  @HttpCode(HttpStatus.OK)
  async get(
    @Param('id') id: number,
    @Body() auth: AuthPersonDto,
  ): Promise<object> {
    if (auth.admin) {
      await this.personsService.requireAdmin({ cpf: auth.cpf });

      const order = await this.ordersService.find(PersonOrderView, { id });
      return { order };
    } else {
      const order = await this.ordersService.find(PersonOrderView, {
        id,
        cpf: auth.cpf,
      });
      return { order };
    }
  }

  @Post(['pagina=:page/itens=:items', 'pagina=:page', '/pagina'])
  @HttpCode(HttpStatus.OK)
  async getPageItems(
    @Param('page') page: number,
    @Param('items') items: number,
    @Body() auth: AuthPersonDto,
  ): Promise<object> {
    if (auth.admin) {
      await this.personsService.requireAdmin({ cpf: auth.cpf });

      const orders = await this.ordersService.findPage(
        OrderView,
        page ?? 0,
        items ?? 0,
      );
      return { orders };
    } else {
      const orders = await this.ordersService.findPersonPage(
        auth.cpf,
        page ?? 0,
        items ?? 0,
      );
      return { orders };
    }
  }
}
