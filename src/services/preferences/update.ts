import { PrismaPreferencesRepository } from '../../repositories/preferences'

export class UpdatePreferenceService {
  constructor(private preferencesRepository: PrismaPreferencesRepository) {}

  async execute(id: string, total_trainings: number) {
    const pref = await this.preferencesRepository.findById(id)

    if (!pref) {
      throw new Error('Preference not found')
    }

    // Categorias que devem atualizar TODAS faixas coloridas
    const coloredCategories = ['kids', 'infanto_juvenil']

    if (coloredCategories.includes(pref.category)) {
      // Atualiza todas as faixas daquela categoria
      await this.preferencesRepository.updateByCategory(
        pref.category,
        total_trainings
      )

      return {
        category: pref.category,
        updated: 'all_category_preferences',
        total_trainings,
      }
    }

    // Para juvenil/adulto → atualiza só aquele ID
    const result = await this.preferencesRepository.updateById(
      pref.id,
      total_trainings
    )

    return result
  }
}
