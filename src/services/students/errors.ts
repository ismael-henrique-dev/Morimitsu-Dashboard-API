export class EmailConflictError extends Error {
  constructor(email: string) {
    super(`O email "${email}" já está cadastrado.`)
    this.name = 'EmailConflictError'
  }
}

export class CPFConflictError extends Error {
  constructor(cpf: string) {
    super(`O CPF "${cpf}" já está cadastrado.`)
    this.name = 'CPFConflictError'
  }
}
