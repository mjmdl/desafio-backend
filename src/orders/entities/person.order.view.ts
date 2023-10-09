import { Person } from 'src/persons/entities/person.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductView } from 'src/products/entities/product.view';
import { ViewEntity, ViewColumn } from 'typeorm';
import { OrderProduct } from './order-product.entity';
import { Order } from './order.entity';

@ViewEntity({
  name: 'pedido_produtos_view',
  dependsOn: [OrderProduct, Order, Product, Person],
  expression: `
		SELECT
			ped.id AS id,
			ped.data_cadastro AS data_cadastro,
			SUM(pedprod.valor_total) AS valor_total,
			JSON_AGG(JSON_BUILD_OBJECT(
				'id', prod.id,
				'name', prod.nome,
				'value', prod.valor,
				'quantity', pedprod.quantidade,
				'totalValue', pedprod.valor_total
			)) AS produtos,
			cli.cpf
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
export class PersonOrderView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  cpf: string;

  @ViewColumn({ name: 'data_cadastro' })
  dateCreated: Date;

  @ViewColumn({ name: 'valor_total' })
  totalValue: number;

  @ViewColumn({ name: 'produtos' })
  products: ProductView[];
}
