import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@erox.com.tr' },
    update: {},
    create: {
      email: 'admin@erox.com.tr',
      phone: '905306659934',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log('Admin user created:', admin.email)

  // Create IBAN accounts
  const ibans = [
    { bankName: 'Ziraat Bankası', accountHolder: 'EROX TİCARET A.Ş.', ibanNumber: 'TR12 0001 0012 3456 7890 1234 56', sortOrder: 0 },
    { bankName: 'Garanti BBVA', accountHolder: 'EROX TİCARET A.Ş.', ibanNumber: 'TR98 0006 2000 1234 5678 9012 34', sortOrder: 1 },
  ]

  for (const iban of ibans) {
    const id = iban.bankName.toLowerCase().replace(/\s/g, '-')
    await prisma.ibanAccount.upsert({
      where: { id },
      update: iban,
      create: { ...iban, id },
    })
  }
  console.log('IBAN accounts seeded:', ibans.length)

  // Create site settings
  const settings = [
    { key: 'phone', value: '+90 532 384 33 37' },
    { key: 'email', value: 'info@erox.com.tr' },
    { key: 'whatsapp', value: '905306659934' },
    { key: 'address_mecidiyekoy', value: 'Mecidiyeköy Mah. Büyükdere Cad. No:45/19 Kat:2 Andaç İş Hanı, 34360 Şişli/İstanbul' },
    { key: 'address_ankara', value: 'Sakarya Cad. Ali Nazmi İşhanı No:1 Kat:2 D:14 Çankaya/Ankara' },
    { key: 'address_kadikoy', value: 'Söğütlüçeşme Cad. Cem İş Hanı No:55 Kat:2 Kadıköy/İstanbul' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log('Site settings seeded:', settings.length)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
