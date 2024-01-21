import {Injectable} from '@nestjs/common';
import {UpdateShareDto} from '../dto/update-share.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Wallet} from "../entities/wallet.entity";

@Injectable()
export class WalletsService {

    constructor(@InjectRepository(Wallet) private walletRepository: Repository<Wallet>) {
    }


    findByName(name: string) {
        return this.walletRepository
            .createQueryBuilder('wallet')
            .leftJoinAndSelect('wallet.holdings', 'holdings')
            .leftJoinAndSelect('wallet.shareHolder', 'shareHolder')
            .where('shareHolder.login = :login', {login: name})
            .getMany();
    }

    update(id: number, updateShareDto: UpdateShareDto) {
        return `This action updates a #${id} share`;
    }

}
