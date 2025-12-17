import 'dotenv/config'
import z from 'zod'

export const ENV = z
  .object({
    PORT: z.string(),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    ADMIN_EMAIL_ADRESS:z.string(),
    ADMIN_PUBLIC_KEY:z.string()
  })
  .parse(process.env)
