import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Share} from "../entities/share.entity";
import {EntityManager, Repository} from "typeorm";
import {ShareHolder} from "../entities/shareholder.entity";
import {Order} from "../entities/order.entity";
import {Holding} from "../entities/holding.entity";
import {OrderDto} from "../dto/order.dto";
import {Wallet} from "../entities/wallet.entity";

@Injectable()
export class OrdersService {

    constructor(@InjectRepository(Share) private shareRepository: Repository<Share>,
                @InjectRepository(ShareHolder) private shareHolderRepository: Repository<ShareHolder>,
                @InjectRepository(Order) private orderRepository: Repository<Order>,
                @InjectRepository(Holding) private holdingRepository: Repository<Holding>,
                private readonly entityManager: EntityManager,) {
    }

    async placeOrder(orderDto: OrderDto, userLogin: string, action: string) {

        //every action will be executed in a single one transaction
        //if something crash, nothing will be committed
        return this.entityManager.transaction(async transactionalEntityManager => {

            //action must be sell or buy
            if (action !== "sell" && action !== "buy") {
                throw new BadRequestException()
            }

            let order = new Order()
            order.quantity = orderDto.quantity
            order.action = action
            order.date = new Date()

            //retrieve share from db
            let share = await transactionalEntityManager.findOne(Share, {
                where: {
                    name: orderDto.shareName
                }
            });
            //todo vco manage exception if share does not exist
            order.share = share;
            //todo vco check here if share.quantity is enough to be bought
            //todo vco check if wallet quantity is enough to be sold
            order.amount = orderDto.quantity * share.price
            order.purchasePrice = share.price

            //retrieve shareHolder from DB. Create it if not entry found
            let shareHolder = await transactionalEntityManager.findOne(ShareHolder, {where: {login: userLogin}})
            if (!shareHolder) {
                let newShareHolder = new ShareHolder()
                newShareHolder.login = userLogin;
                shareHolder = await transactionalEntityManager.save(ShareHolder, newShareHolder)
            }
            order.shareHolder = shareHolder

            //if shareHolder buy share, decrease share available quantity
            if (action === "buy") {
                share.quantity -= orderDto.quantity
            } else {
                share.quantity += orderDto.quantity
            }
            //update share quantity
            await transactionalEntityManager.update(Share, share.id, {quantity: share.quantity});


            let wallet = await transactionalEntityManager.createQueryBuilder(Wallet, 'wallet')
                .innerJoinAndSelect('wallet.shareHolder', 'shareHolder')
                .innerJoinAndSelect('wallet.holdings', 'holdings')
                .where('shareHolder.login = :login', {login: userLogin})
                .getOne();

            console.log(JSON.stringify(wallet))
            if (!wallet) {
                wallet = new Wallet();
                wallet.shareHolder = shareHolder

                let holding = new Holding()

                holding.shareName = orderDto.shareName;
                holding.quantity = orderDto.quantity

                wallet.holdings = [holding]
                console.log(JSON.stringify(holding))
                await transactionalEntityManager.save(Wallet, wallet)
            } else {

                let targetShare = wallet.holdings
                    .find(s => s.shareName === orderDto.shareName)
                if (!targetShare) {
                    let holding = new Holding()
                    holding.shareName = orderDto.shareName;
                    holding.quantity = orderDto.quantity
                    wallet.holdings.push(holding)
                    await transactionalEntityManager.save(Wallet, wallet)
                } else {

                    if (action === "buy") {
                        targetShare.quantity += orderDto.quantity
                    } else {
                        targetShare.quantity -= orderDto.quantity
                    }
                    await transactionalEntityManager.save(Wallet, wallet)
                }
            }


            return await transactionalEntityManager.save(Order, order);
        })
    }

    async history(login: string) {

        return this.orderRepository
            .createQueryBuilder('order')
            .select([
                'order.action',
                'order.quantity',
                'order.amount',
                'order.date',
                'order.purchasePrice',
                'share.name'
            ])
            .innerJoin('order.share', 'share')
            .innerJoin('order.shareHolder', 'shareHolder')
            .where('shareHolder.login = :login', {login})
            .getMany();
    }
}
