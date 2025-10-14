import { classes, Prisma } from '@prisma/client'
import { ClassesRepositoryInterface } from '../../repositories/classes'

export class CreateClassService {
  constructor(private classRepository: ClassesRepositoryInterface) {}

  async handle(data: Prisma.classesUncheckedCreateInput): Promise<classes> {
    const { max_age, min_age, instructor_id, name, schedule, id, sessions, students } =
      data

    // const doesTheInstructorExists = await this.instructorRepository(instructor_id);
    // if(!doesTheInstructorExists){
    //   throw new Error("Instrutor nao existente")
    // }

    const _data = await this.classRepository.create(data)
    return _data
  }
}
