import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'pessoa_view',
  expression: `
		SELECT
			pessoa.nome AS nome,
			pessoa.cpf AS cpf,
			pessoa.admin AS admin
		FROM
			public.pessoa AS pessoa
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
