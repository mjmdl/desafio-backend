import { ViewColumn, ViewEntity } from 'typeorm';

const VIEW_NAME = 'pessoa_view';

@ViewEntity({
  name: VIEW_NAME,
  expression: `
		SELECT
			p.nome AS nome,
			p.cpf AS cpf,
			p.admin AS admin
		FROM
			public.pessoa AS p
	`,
})
export class PersonView {
  @ViewColumn({ name: 'nome' })
  name: string;

  @ViewColumn()
  cpf: string;

  @ViewColumn()
  admin: boolean;
}
