import {Body, Controller, Get, Post} from '@nestjs/common';
import {OrdersService} from "../services/orders.service";
import {OrderDto} from "../dto/order.dto";

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) {
    }

    @Post("/buy")
    async buy(@Body() orderDto: OrderDto) {
        //todo vco extract user info from token using guard
        return await this.orderService.placeOrder(orderDto, "todo", "buy");
    }

    @Post("/sell")
    async sell(@Body() orderDto: OrderDto) {
        //todo vco extract user info from token using guard
        return await this.orderService.placeOrder(orderDto, "todo", "sell");
    }

    @Get("/history")
    async history() {
        //todo vco extract user info from token using guard
        return await this.orderService.history("todo");
    }

}
