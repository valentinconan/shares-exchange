import {Injectable} from '@nestjs/common';
import {CreateShareDto} from '../dto/create-share.dto';
import {UpdateShareDto} from '../dto/update-share.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Share} from "../entities/share.entity";
import {Repository} from "typeorm";
import {ShareHolder} from "../entities/shareholder.entity";
import {Order} from "../entities/order.entity";
import {Holding} from "../entities/holding.entity";

@Injectable()
export class HoldingsService {

    constructor(@InjectRepository(Share) private shareRepository: Repository<Share>,
                @InjectRepository(ShareHolder) private shareHolderRepository: Repository<ShareHolder>,
                @InjectRepository(Order) private orderRepository: Repository<Order>,
                @InjectRepository(Holding) private holdingRepository: Repository<Holding>) {
    }

    create(createShareDto: CreateShareDto) {
        return this.shareRepository.save(createShareDto);
    }

    findByName(name: string) {
        return this.holdingRepository
            .createQueryBuilder('holding')
            .leftJoinAndSelect('holding.share', 'share')
            .leftJoinAndSelect('holding.shareHolder', 'shareHolder')
            .where('shareHolder.login = :login', {login: name})
            .getMany();
    }

    update(id: number, updateShareDto: UpdateShareDto) {
        return `This action updates a #${id} share`;
    }

    remove(id: number) {
        return `This action removes a #${id} share`;
    }
}
