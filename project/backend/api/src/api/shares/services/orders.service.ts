import {BadRequestException, HttpException, Injectable} from '@nestjs/common';
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
                @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
                private readonly entityManager: EntityManager,) {
    }

    /**
     * Place order if it's possible. Revert all actions if error
     * @param orderDto
     * @param userLogin
     * @param action
     */
    async placeOrder(orderDto: OrderDto, userLogin: string, action: string) {

        //every action will be executed in a single one transaction
        //if something crash, nothing will be committed
        return this.entityManager.transaction(async transactionalEntityManager => {

            //action must be sell or buy
            if (action !== "sell" && action !== "buy") {
                throw new BadRequestException()
            }

            //Order object will be updated with all actions information
            let order = new Order()
            order.quantity = orderDto.quantity
            order.action = action
            order.date = new Date()

            //retrieve share from db. Throw exception if share does not exist
            let share = await this.retrieveShare(transactionalEntityManager, orderDto);

            order.share = share;

            let shareHolder = await this.retrieveOrCreateShareHolder(transactionalEntityManager, userLogin);
            order.shareHolder = shareHolder

            //Retrieve wallet, create it if not exist
            let wallet = await this.retrieveOrCreateWallet(transactionalEntityManager, userLogin, shareHolder);

            //update potential amount depending on ordered quantity and price
            order.amount = orderDto.quantity * share.price

            if (action === "buy") {

                //throw if not enough share quantity are available to purchase
                if (share.quantity < orderDto.quantity) {
                    throw new HttpException(`Share [${orderDto.shareName}] quantity is not enough to place this order`, 410)
                }

                //decrease share available quantity
                share.quantity -= orderDto.quantity

                //search for the holding bound to the current share. In case of purchase, initialise it if not exist
                this.retrieveOrCreateHolding(wallet, orderDto);

                await transactionalEntityManager.save(Wallet, wallet)

            } else {

                //in case of selling share
                //throw if not enough shares are available on the user wallet
                await this.retrieveOrUpdateHolding(wallet, orderDto, share, transactionalEntityManager);
            }
            order.purchasePrice = share.price

            //finally update share quantity
            await transactionalEntityManager.update(Share, share.id, {quantity: share.quantity});

            //then save the order
            return await transactionalEntityManager.save(Order, order);
        })
    }

    private async retrieveOrUpdateHolding(wallet: Wallet, orderDto: OrderDto, share: Share, transactionalEntityManager: EntityManager) {
        let targetHolding = wallet.holdings
            .find(s => s.shareName === orderDto.shareName)
        if (!targetHolding) {
            //if no holding bound to this share exist, it's not possible to sell any share
            throw new HttpException(`Share [${orderDto.shareName}] not available in user wallet`, 410)
        } else {

            if (targetHolding.quantity < orderDto.quantity) {
                throw new HttpException(`Wallet quantity for share [${orderDto.shareName}] is not enough to place this order`, 410)
            }
            share.quantity += orderDto.quantity
            targetHolding.quantity -= orderDto.quantity

            await transactionalEntityManager.save(Wallet, wallet)
        }
    }

    private retrieveOrCreateHolding(wallet: Wallet, orderDto: OrderDto) {
        let targetHolding = wallet?.holdings
            ?.find(s => s.shareName === orderDto.shareName)
        if (!targetHolding) {
            //create a new holding and add first shares
            let holding = new Holding()
            holding.shareName = orderDto.shareName;
            holding.quantity = orderDto.quantity
            wallet.holdings.push(holding)
        } else {
            //update by reference the current Holding
            targetHolding.quantity += orderDto.quantity
        }
    }

    private async retrieveOrCreateWallet(transactionalEntityManager: EntityManager, userLogin: string, shareHolder: ShareHolder) {
        let wallet = await transactionalEntityManager.createQueryBuilder(Wallet, 'wallet')
            .innerJoinAndSelect('wallet.shareHolder', 'shareHolder')
            .innerJoinAndSelect('wallet.holdings', 'holdings')
            .where('shareHolder.login = :login', {login: userLogin})
            .getOne();

        if (!wallet) {
            wallet = new Wallet();
            wallet.shareHolder = shareHolder
            wallet.holdings = []
            wallet = await transactionalEntityManager.save(Wallet, wallet)
        }
        return wallet;
    }

    private async retrieveOrCreateShareHolder(transactionalEntityManager: EntityManager, userLogin: string) {
        //retrieve shareHolder from DB. Create it if not entry found
        let shareHolder = await transactionalEntityManager.findOne(ShareHolder, {where: {login: userLogin}})
        if (!shareHolder) {
            let newShareHolder = new ShareHolder()
            newShareHolder.login = userLogin;
            shareHolder = await transactionalEntityManager.save(ShareHolder, newShareHolder)
        }
        return shareHolder;
    }

    private async retrieveShare(transactionalEntityManager: EntityManager, orderDto: OrderDto) {
        let share = await transactionalEntityManager.findOne(Share, {
            where: {
                name: orderDto.shareName
            }
        });

        if (!share) {
            throw new HttpException(`Share [${orderDto.shareName}] not found`, 404)
        }
        return share;
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