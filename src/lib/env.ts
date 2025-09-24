import 'dotenv/config'
import z from 'zod'

export const ENV = z
  .object({
    PORT: z.string(),
    HOST: z.string(),
    DATABASE_URL: z.string(),
  })
  .parse(process.env)
