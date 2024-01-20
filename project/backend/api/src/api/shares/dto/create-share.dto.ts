import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateShareDto {


    constructor(name: string, quantity: number, price: number) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }

    @IsString()
    @IsNotEmpty()
    name: string


    @IsNumber()
    @IsNotEmpty()
    quantity: number


    @IsNumber()
    @IsNotEmpty()
    price: number
}
