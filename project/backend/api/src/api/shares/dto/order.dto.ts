import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class OrderDto {
    @IsNumber()
    @IsNotEmpty()
    quantity: number

    @IsString()
    @IsNotEmpty()
    shareName: string

}
