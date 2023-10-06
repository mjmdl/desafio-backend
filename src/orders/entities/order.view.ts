import { PersonView } from 'src/persons/entities/person.view';
import { ProductView } from 'src/products/entities/product.view';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'pedido_view',
  expression: `
		SELECT
			ped.id AS id,
			JSON_BUILD_OBJECT(
				'cpf', cli.cpf,
				'nome', cli.nome
			) AS cliente,
			JSON_AGG(JSON_BUILD_OBJECT(
				'id', prod.id,
				'nome', prod.nome,
				'valor', prod.valor,
				'quantidade', pedprod.quantidade,
				'valor_total', pedprod.valor_total
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
			ped.id, cli.cpf, cli.nome
	`,
})
export class OrderView {
  @ViewColumn()
  id: number;

  @ViewColumn({ name: 'cliente' })
  cliente: PersonView;

  @ViewColumn({ name: 'produtos' })
  products: ProductView[];
}
