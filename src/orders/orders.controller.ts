import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('pedidos')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async post(@Body() creation: CreateOrderDto): Promise<void> {
    await this.ordersService.create(creation);
  }

  @Get()
  async getFirstPage(): Promise<object> {
    return { orders: await this.ordersService.findViewPage(0) };
  }

  @Get('/pagina=:page')
  async getPage(@Param('page') page: number): Promise<object> {
    return { orders: await this.ordersService.findViewPage(page) };
  }
}
