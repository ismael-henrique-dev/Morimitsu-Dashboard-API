import { PrismaPreferencesRepository } from '../../repositories/preferences'

export class GetPreferencesService {
  constructor(private preferencesRepository: PrismaPreferencesRepository) {}

  async execute() {
    const prefs = await this.preferencesRepository.findAll()

    const result: any[] = []

    const kids = prefs.filter((p) => p.category === 'kids')
    if (kids.length > 0) {
      result.push({
        id: kids[0].id,
        category: 'KIDS',
        belt: 'colored_belts',
        minAge: kids[0].min_age,
        maxAge: kids[0].max_age,
        totalTrains: kids[0].total_trainings,
      })
    }

    const infant = prefs.filter((p) => p.category === 'infanto_juvenil')
    if (infant.length > 0) {
      result.push({
        id: infant[0].id,
        category: 'INFANTO-JUVENIL',
        belt: 'colored_belts',
        minAge: infant[0].min_age,
        maxAge: infant[0].max_age,
        totalTrains: infant[0].total_trainings,
      })
    }

    const adult = prefs.filter((p) => p.category === 'juvenil_adulto')
    adult.forEach((item) => {
      result.push({
        id: item.id,
        category: 'JUVENIL-ADULTO',
        belt: item.belt, // **faixa real**
        minAge: adult[0].min_age,
        maxAge: adult[0].max_age,
        totalTrains: item.total_trainings,
      })
    })

    return result
  }
}
