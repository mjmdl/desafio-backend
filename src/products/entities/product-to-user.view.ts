import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'produto_ao_usuario_view',
  expression: `
		SELECT
			nome,
			valor,
			favorito,
			descricao,
			data_cadastro
		FROM
			produto
		ORDER BY
			favorito DESC,
			nome ASC
	`,
})
export class ProductToUserView {
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
