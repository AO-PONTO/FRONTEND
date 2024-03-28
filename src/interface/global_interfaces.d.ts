export interface propsPage {
  view: string
}

export interface propsView {
  setView: React.Dispatch<React.SetStateAction<string>>
}

export interface propsPageLogin {
  setLogged: React.Dispatch<React.SetStateAction<boolean>>
}

export interface cadEsc {
  categoria_administrativa: string
  cep: string
  created_at: string
  endereco: string
  etapa_ensino: string
  inep_codigo: string
  municipio: string
  nome: string
  uf: string
  updated_at: string | null
  uuid: string
}

export interface dataEsc {
  nome: string
  inep_codigo: string
  uf: string
  municipio: string
  cep: string
  endereco: string,
  categoria_administrativa: string
  etapa_ensino: string
  uuid: string
  created_at: string
  updated_at: string
}

export interface cadUser {
  nome: string
  access_level: string
  active: boolean
  cpf: string
  created_at: string
  data_nascimento: string
  email: string
  escola_name: string
  escola_uuid: string
  papel_name: string
  papel_uuid: string
  senha: string
  updated_at: string | null
  uuid: string
}

export interface dataUser {
  nome: string
  cpf: string
  email: string
  data_nascimento: string
  active: boolean
  escola_uuid: string
  papel_uuid: string
  escola_name: string
  papel_name: string
  access_level: number
  uuid: string
  created_at: string
  updated_at: string
}

export interface cadSala {
  nome: string
  ano: string
  turno: string
  escola_uuid: string
  uuid: string
  created_at: string
  updated_at: string | null
}

export interface dataSala {
  nome: string
  ano: string
  turno: string
  escola_uuid: string
  uuid: string
  created_at: string
  updated_at: string
}

export interface horario {
  dia: string,
  hora: string
}

export interface cadTurma {
  disciplina: string
  sala: string
  nome_professor: string
  horario: horario[]
  uuid: string
  created_at: string
  updated_at: string | null
}

export interface dataTurma {
  disciplina: string
  sala: string
  nome_professor: string
  horario: string
  uuid: string
  created_at: string
  updated_at: string | null
}

export interface cadDisciplinas {
  created_at: string
  name: string
  updated_at: string | null
  uuid: string
}

export interface dataDisciplinas {
  created_at: string
  name: string
  updated_at: string
  uuid: string
}

export interface cadAluno {
  created_at: string
  data_nascimento: string
  escola_name: string
  escola_uuid: string
  matricula: string
  nome: string
  updated_at: string | null
  uuid: string
}

export interface dataAluno {
  escola_uuid: string
  escola_name: string
  matricula: string
  nome: string
  data_nascimento: string
  uuid: string
  created_at: string
  updated_at: string
}


export interface cadCardapio {
  created_at: string
  descricao: string
  nome: string
  updated_at: string | null
  uuid: string
}

export interface dataCardapio {
  nome: string
  descricao: string
  uuid: string
  created_at: string
  updated_at: string
}

export interface cadCardEsc {
  cardapio_descricao: string
  cardapio_name: string
  cardapio_uuid: string
  created_at: string
  dia_da_semana: string
  escola_uuid: string
  turno: string
  updated_at: string | null
  uuid: string
}

export interface dataCardEsc {
  escola_uuid: string
  cardapio_uuid: string
  cardapio_name: string
  cardapio_descricao: string
  dia_da_semana: string
  turno: string
  uuid: string
  created_at: string
  updated_at: string
}
export interface cadRelatMer {
  created_at: string
  data: string
  escola_name: string
  escola_uuid: string
  numero_alunos: string | number
  sobra_limpa: string | number
  sobra_suja: string | number
  updated_at: string | null
  uuid: string
}

export interface dataRelatMer {
  escola_uuid: string
  escola_name: string
  numero_alunos: string
  sobra_limpa: string
  sobra_suja: string
  data: string
  uuid: string
  created_at: string
  updated_at: string
}

export interface cadAlunoTurma {
  aluno_uuid: string
  turma_uuid: string
  turma_name: string
  uuid: string
  created_at: string
  updated_at: string
}

export interface dataFrequencia {
  aluno_turmas_uuid: string
  chamada: boolean
  data: string
  hora: string
  uuid: string
  created_at: string
  updated_at: string | null
}

export interface propSelect {
  name: string
  uuid: string
}

export interface papelRequest {
  nome: string
  uuid: string
  access_level: number
}

export interface cardapioRequest {
  nome: string
  uuid: string
  descricao: string
}

export interface typeCep {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}