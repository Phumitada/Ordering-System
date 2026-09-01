import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../db/prisma'

async function main() {
  console.log('🌱 Seeding database...')

  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      phoneNumber: '0800000000',
      role: 'ADMIN',
    },
  })
  console.log('✓ Admin user:', admin.email, '(password: Admin123!)')

  const category = await prisma.category.upsert({
    where: { id: 'seed-category-drinks' },
    update: {},
    create: {
      id: 'seed-category-drinks',
      name: 'เครื่องดื่ม',
      isActive: true,
    },
  })
  console.log('✓ Category:', category.name)

  const products = [
    { id: 'seed-product-latte', name: 'คาเฟ่ลาเต้', price: 55, defaultStock: 20 },
    { id: 'seed-product-matcha', name: 'มัทฉะลาเต้', price: 65, defaultStock: 15 },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        description: `${p.name} หอมกลมกล่อม`,
        price: p.price,
        defaultStock: p.defaultStock,
        // placeholder image — แทนที่ด้วยรูปจริงผ่านหน้า Admin ได้เลย
        image: 'https://placehold.co/400x300?text=' + encodeURIComponent(p.name),
        categoryId: category.id,
        isActive: true,
      },
    })
  }
  console.log(`✓ Products: ${products.length} items`)

  console.log('🌱 Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
