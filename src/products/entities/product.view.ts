import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'produto_view',
  expression: `
		SELECT 
      id,
			nome,
			valor,
			favorito,
			descricao,
			data_cadastro
		FROM
			produto
    ORDER BY
      id
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
