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

    const infanto = prefs.filter((p) => p.category === 'infanto_juvenil')
    if (infanto.length > 0) {
      result.push({
        id: infanto[0].id,
        category: 'INFANTO-JUVENIL',
        belt: 'colored_belts',
        minAge: infanto[0].min_age,
        maxAge: infanto[0].max_age,
        totalTrains: infanto[0].total_trainings,
      })
    }

    const adulto = prefs.filter((p) => p.category === 'juvenil_adulto')
    adulto.forEach((item) => {
      result.push({
        id: item.id,
        category: 'JUVENIL-ADULTO',
        belt: item.belt, // **faixa real**
        totalTrains: item.total_trainings,
      })
    })

    return result
  }
}
