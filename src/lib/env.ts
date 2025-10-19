import 'dotenv/config'
import z from 'zod'

export const ENV = z
  .object({
    PORT: z.string(),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string()
  })
  .parse(process.env)
