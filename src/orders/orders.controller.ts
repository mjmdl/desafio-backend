import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderView } from './entities/order.view';

@Controller('pedidos')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async post(@Body() creation: CreateOrderDto): Promise<void> {
    await this.ordersService.create(creation);
  }

  @Get()
  async getFirstPage(): Promise<object> {
    return { orders: await this.ordersService.findPage(OrderView, 0) };
  }

  @Get('/pagina=:page')
  async getPage(@Param('page') page: number): Promise<object> {
    return { orders: await this.ordersService.findPage(OrderView, page) };
  }

  @Get('/pagina=:page/itens=:items')
  async getPageItems(@Param() params: any): Promise<object> {
    return {
      orders: await this.ordersService.findPage(
        OrderView,
        params['page'],
        params['items'],
      ),
    };
  }
}
