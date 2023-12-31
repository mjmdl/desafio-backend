import { PersonView } from 'src/persons/entities/person.view';
import { ProductView } from 'src/products/entities/product.view';
import { ViewColumn, ViewEntity } from 'typeorm';
import { OrderProduct } from './order-product.entity';
import { Product } from 'src/products/entities/product.entity';
import { Order } from './order.entity';
import { Person } from 'src/persons/entities/person.entity';

@ViewEntity({
  name: 'pedido_pessoa_produtos_view',
  dependsOn: [OrderProduct, Order, Product, Person],
  expression: `
		SELECT
			ped.id AS id,
			ped.data_cadastro AS data_cadastro,
			SUM(pedprod.valor_total) AS valor_total,
			JSON_BUILD_OBJECT(
				'cpf', cli.cpf,
				'name', cli.nome
			) AS cliente,
			JSON_AGG(JSON_BUILD_OBJECT(
				'id', prod.id,
				'name', prod.nome,
				'value', prod.valor,
				'quantity', pedprod.quantidade,
				'totalValue', pedprod.valor_total
			)) AS produtos
		FROM
			pedidos_produtos AS pedprod
		LEFT JOIN
			pedido AS ped ON ped.id = pedprod.id_pedido
		LEFT JOIN
			produto AS prod ON prod.id = pedprod.id_produto
		LEFT JOIN
			pessoa AS cli ON cli.id = ped.id_pessoa
		GROUP BY
			ped.id, 
			cli.cpf, 
			cli.nome
		ORDER BY
			ped.data_cadastro DESC, 
			ped.id ASC
	`,
})
export class OrderView {
  @ViewColumn()
  id: number;

  @ViewColumn({ name: 'data_cadastro' })
  dateCreated: Date;

  @ViewColumn({ name: 'valor_total' })
  totalValue: number;

  @ViewColumn({ name: 'cliente' })
  client: PersonView;

  @ViewColumn({ name: 'produtos' })
  products: ProductView[];
}
