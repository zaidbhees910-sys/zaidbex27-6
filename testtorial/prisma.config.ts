import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    db: {
      url: 'postgresql://postgres:palepale12345%40Zai@db.hfjcfvamzoiufwuaheki.supabase.co:5432/postgres'
    }
  },
})