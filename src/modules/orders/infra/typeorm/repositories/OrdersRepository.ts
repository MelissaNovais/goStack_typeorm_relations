import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
  private ormOrderRepository: Repository<Order>;

  private ormOrderProductsRepository: Repository<OrdersProducts>;

  constructor() {
    this.ormOrderRepository = getRepository(Order);
    this.ormOrderProductsRepository = getRepository(OrdersProducts);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = await this.ormOrderRepository.create({
      customer,
      order_products: products,
    });
    await this.ormOrderRepository.save(order);

    const productsWithOrder = products.map(product => {
      return {
        ...product,
        order,
      };
    });
    await this.ormOrderProductsRepository.save(productsWithOrder);
    return order;
  }

  // findOrderAndProductsAndCustomer
  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormOrderRepository.findOne(id, {
      relations: ['order_products', 'customer'],
    });
    return order;
  }
}

export default OrdersRepository;
