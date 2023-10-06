import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'produto_view',
  expression: `
		SELECT
      produto.id AS id,
			produto.nome AS nome,
			produto.valor AS valor,
			produto.favorito AS favorito,
			produto.descricao AS descricao,
			produto.data_cadastro AS data_cadastro
		FROM
			public.produto AS produto
	`,
})
export class ProductView {
  @ViewColumn()
  id: number;

  @ViewColumn({ name: 'nome' })
  name: string;

  @ViewColumn({ name: 'valor' })
  value: number;

  @ViewColumn({ name: 'favorito' })
  favorite: boolean;

  @ViewColumn({ name: 'descricao' })
  description: string;

  @ViewColumn({ name: 'data_cadastro' })
  dateCreated: string;
}
