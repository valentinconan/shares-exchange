import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class OrderDto {
    @IsNumber()
    @IsNotEmpty()
    quantity: number

    @IsString()
    @IsNotEmpty()
    shareHolderLogin: string

    @IsString()
    @IsNotEmpty()
    shareName: string

}
