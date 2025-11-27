import { UsersRepository } from "../../repositories/users"

export class GetUsersService {
  constructor(private usersRepository: UsersRepository) {}

  async execute() {
    return await this.usersRepository.findInstructors()
  }
}
