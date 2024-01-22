import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import {OrdersService} from "../services/orders.service";
import {OrderDto} from "../dto/order.dto";
import {Roles} from "../../../decorators/roles/roles.decorator";
import {Role} from "../../../decorators/roles/role";

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) {
    }

    @Roles(Role.write)
    @Post("/buy")
    async buy(@Body() orderDto: OrderDto, @Req() request) {
        return await this.orderService.placeOrder(orderDto, request.user.login, "buy");
    }

    @Roles(Role.write)
    @Post("/sell")
    async sell(@Body() orderDto: OrderDto, @Req() request) {
        return await this.orderService.placeOrder(orderDto, request.user.login, "sell");
    }

    @Roles(Role.read)
    @Get("/history")
    async history(@Req() request) {
        return await this.orderService.history(request.user.login);
    }

}
