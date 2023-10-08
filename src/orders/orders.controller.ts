import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderView } from './entities/order.view';
import { AuthPersonDto } from 'src/persons/dto/auth-person.dto';
import { PersonsService } from 'src/persons/persons.service';

@Controller('pedidos')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly personsService: PersonsService,
  ) {}

  @Post()
  async post(@Body() creation: CreateOrderDto): Promise<void> {
    await this.ordersService.create(creation);
  }

  @Get(['pagina=:page/itens=:items', 'pagina=:page', '/pagina'])
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
      const orders = await this.ordersService.findPageOfPerson(
        OrderView,
        auth.cpf,
        page ?? 0,
        items ?? 0,
      );
      return { orders };
    }
  }
}
