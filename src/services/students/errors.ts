export class EmailConflictError extends Error {
  constructor(email: string) {
    super(`O email já está cadastrado.`)
    this.name = 'EmailConflictError'
  }
}

export class CPFConflictError extends Error {
  constructor(cpf: string) {
    super(`O CPF é invalido.`)
    this.name = 'CPFConflictError'
  }
}
