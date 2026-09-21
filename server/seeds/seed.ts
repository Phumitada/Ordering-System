import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../db/prisma'

// รูปทั้งหมดดึงจาก Wikimedia Commons (เนื้อหาเปิด ใช้ hotlink ได้จริง) — เลือกและตรวจสอบแล้วว่าตรงกับสินค้า/บทความแต่ละอัน
// รันซ้ำได้เรื่อยๆ (ผูกกับ `npm run dev`) — ใช้ upsert ที่ sync ทุก field ทับของเดิมเสมอ ไม่มี duplicate เพราะ id คงที่
const commonsImage = (filename: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=800`

async function main() {
  console.log('🌱 Seeding database...')

  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {}, // ไม่ sync ทับ — เผื่อมีคนเปลี่ยนรหัสผ่าน admin ระหว่าง dev แล้วไม่อยากให้ถูกรีเซ็ตทุกครั้งที่ dev restart
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
    update: { name: 'เครื่องดื่ม', isActive: true },
    create: {
      id: 'seed-category-drinks',
      name: 'เครื่องดื่ม',
      isActive: true,
    },
  })
  console.log('✓ Category:', category.name)

  const products = [
    { id: 'seed-product-latte', name: 'คาเฟ่ลาเต้', price: 55, defaultStock: 20, image: commonsImage('Caffe Latte.jpg') },
    { id: 'seed-product-matcha', name: 'มัทฉะลาเต้', price: 65, defaultStock: 15, image: commonsImage('Matcha latte.jpg') },
  ]

  for (const p of products) {
    const data = {
      name: p.name,
      description: `${p.name} หอมกลมกล่อม`,
      price: p.price,
      defaultStock: p.defaultStock,
      image: p.image,
      categoryId: category.id,
      isActive: true,
    }
    await prisma.product.upsert({
      where: { id: p.id },
      update: data,
      create: { id: p.id, ...data },
    })
  }
  console.log(`✓ Products: ${products.length} items`)

  const bakeryCategory = await prisma.category.upsert({
    where: { id: 'seed-category-bakery' },
    update: { name: 'เบเกอรี่', isActive: true },
    create: {
      id: 'seed-category-bakery',
      name: 'เบเกอรี่',
      isActive: true,
    },
  })
  console.log('✓ Category:', bakeryCategory.name)

  // ตัวอย่างเมนูขายดี — ตั้ง recommend ไว้ให้ขึ้นโชว์ในส่วน "เมนูยอดฮิต" ของหน้าแรก
  const bakeryProducts = [
    { id: 'seed-product-croissant', name: 'ครัวซองต์เนยสด', price: 45, defaultStock: 25, recommend: true, image: commonsImage('Freshly baked croissants.jpg') },
    { id: 'seed-product-wholewheat', name: 'ขนมปังโฮลวีท', price: 60, defaultStock: 15, recommend: false, image: commonsImage('Vegan Nine Grain Whole Wheat Bread.jpg') },
    { id: 'seed-product-brownie', name: 'บราวนี่ช็อกโกแลตเข้มข้น', price: 55, defaultStock: 20, recommend: true, image: commonsImage('Chocolate brownies without table.jpg') },
    { id: 'seed-product-sourdough', name: 'ขนมปังซาวร์โดว์', price: 120, defaultStock: 10, recommend: true, image: commonsImage('Sourdough Bread Loaf.jpg') },
  ]

  for (const p of bakeryProducts) {
    const data = {
      name: p.name,
      description: `${p.name} อบสดใหม่ทุกวัน`,
      price: p.price,
      defaultStock: p.defaultStock,
      image: p.image,
      categoryId: bakeryCategory.id,
      isActive: true,
      recommend: p.recommend ? 'แนะนำ' : '',
    }
    await prisma.product.upsert({
      where: { id: p.id },
      update: data,
      create: { id: p.id, ...data },
    })
  }
  console.log(`✓ Products: ${bakeryProducts.length} items`)

  const promotions = [
    {
      id: 'seed-promo-newyear',
      title: 'ลด 20% เมนูเบเกอรี่ทั้งร้าน',
      description: 'ลดพิเศษสำหรับลูกค้าที่สั่งเมนูเบเกอรี่ครบ 300 บาทขึ้นไป เฉพาะสั่งผ่านหน้าเว็บเท่านั้น',
      badgeText: 'ลด 20%',
      image: commonsImage('Sourdough miche & boule.jpg'),
      isActive: true,
    },
    {
      id: 'seed-promo-buy1get1',
      title: 'ครัวซองต์ ซื้อ 3 แถม 1',
      description: 'สั่งครัวซองต์เนยสดครบ 3 ชิ้น รับฟรีเพิ่มอีก 1 ชิ้นทันที ไม่มีขั้นต่ำอื่นเพิ่มเติม',
      badgeText: 'ซื้อ 3 แถม 1',
      image: commonsImage('Croissant, whole.jpg'),
      isActive: true,
    },
  ]

  for (const { id, ...data } of promotions) {
    await prisma.promotion.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    })
  }
  console.log(`✓ Promotions: ${promotions.length} items`)

  const blogPosts = [
    {
      id: 'seed-blog-storage',
      title: '5 เคล็ดลับเก็บรักษาขนมปังโฮมเมดให้สดอร่อยได้นานขึ้น',
      slug: 'keep-homemade-bread-fresh-longer',
      coverImage: commonsImage('Loaf of sourdough bread cooling.jpg'),
      excerpt: 'ขนมปังโฮมเมดไม่มีสารกันบูด แต่ก็สามารถเก็บให้อร่อยได้นานขึ้นถ้ารู้วิธี มาดู 5 เทคนิคง่ายๆ ที่ทำตามได้ทันทีที่บ้าน',
      content: `ขนมปังที่อบสดใหม่จากเตามีความอร่อยที่หาไม่ได้จากที่ไหน แต่ปัญหาที่ตามมาคือขนมปังโฮมเมดมักไม่มีสารกันบูด ทำให้เสียเร็วกว่าขนมปังตามท้องตลาดทั่วไป วันนี้ Siri Bakery ขอมาแชร์วิธีเก็บรักษาขนมปังให้อยู่ได้นานขึ้นโดยไม่เสียรสชาติและเนื้อสัมผัส

1. ปล่อยให้เย็นสนิทก่อนเก็บ
ข้อผิดพลาดที่พบบ่อยที่สุดคือการรีบห่อขนมปังตั้งแต่ยังอุ่นอยู่ ไอน้ำที่ระเหยออกมาจะไปสะสมอยู่ในถุงหรือกล่อง ทำให้เกิดความชื้นและเชื้อราขึ้นได้ง่าย ควรวางขนมปังบนตะแกรงให้เย็นสนิทอย่างน้อย 1-2 ชั่วโมงก่อนนำไปเก็บ

2. เลือกภาชนะให้เหมาะกับชนิดขนมปัง
ขนมปังเปลือกกรอบอย่างบาแก็ตหรือซาวร์โดว์ควรเก็บในถุงกระดาษหรือผ้าขนหนูสะอาดที่ระบายอากาศได้ เพื่อคงความกรอบของเปลือกไว้ ส่วนขนมปังเนื้อนุ่มอย่างขนมปังโฮลวีทหรือขนมปังแซนด์วิช ควรเก็บในถุงพลาสติกสุญญากาศหรือกล่องปิดสนิทเพื่อกันความชื้นระเหยออกจนเนื้อแห้งกระด้าง

3. เก็บที่อุณหภูมิห้อง ไม่ใช่ในตู้เย็น
หลายคนเข้าใจผิดว่าแช่ตู้เย็นจะช่วยยืดอายุขนมปัง แต่ความจริงแล้วอุณหภูมิเย็นในตู้เย็นทำให้แป้งคืนตัวเร็วขึ้น (staling) ทำให้ขนมปังแข็งและแห้งเร็วกว่าเก็บที่อุณหภูมิห้องเสียอีก ควรเก็บขนมปังไว้ในที่แห้ง ไม่โดนแดด และเก็บได้ไม่เกิน 2-3 วันสำหรับขนมปังไม่ใส่สารกันบูด

4. แช่แข็งถ้าต้องเก็บนานกว่า 3 วัน
หากซื้อมาเยอะหรืออบเผื่อไว้ วิธีที่ดีที่สุดคือหั่นเป็นชิ้นตามต้องการ ห่อด้วยพลาสติกแรปให้แน่น แล้วใส่ถุงซิปล็อกอีกชั้นก่อนแช่แข็ง เก็บได้นานถึง 1 เดือน เวลาจะกินก็นำออกมาอุ่นในเตาอบหรือเครื่องปิ้งขนมปังได้ทันทีโดยไม่ต้องละลายก่อน รสชาติและเนื้อสัมผัสยังใกล้เคียงของสดมาก

5. อุ่นให้ถูกวิธีก่อนเสิร์ฟ
ขนมปังที่เก็บไว้ 1-2 วันมักจะแข็งขึ้นเล็กน้อย วิธีคืนความนุ่มคือพรมน้ำเปล่าบางๆ ที่ผิวขนมปัง แล้วนำเข้าเตาอบที่อุณหภูมิ 150 องศาเซลเซียส ประมาณ 5-8 นาที ไอน้ำจะช่วยให้เนื้อขนมปังนุ่มขึ้นและเปลือกกรอบเหมือนเพิ่งอบใหม่

ลองนำเทคนิคเหล่านี้ไปใช้กับขนมปังจาก Siri Bakery ที่บ้านดูนะครับ รับรองว่าจะได้กินขนมปังอร่อยๆ ได้นานขึ้นแน่นอน`,
    },
    {
      id: 'seed-blog-birthday-cake',
      title: 'เลือกเค้กวันเกิดยังไงให้ถูกใจทั้งเจ้าของงานและแขก',
      slug: 'how-to-choose-birthday-cake',
      coverImage: commonsImage('American Birthday Cake.jpg'),
      excerpt: 'สั่งเค้กวันเกิดทั้งที อยากให้ถูกใจทุกคนในงาน มาดูหลักการเลือกเค้กแบบมือโปรที่ช่วยให้ตัดสินใจง่ายขึ้น',
      content: `การเลือกเค้กวันเกิดสักก้อนอาจดูเป็นเรื่องเล็ก แต่จริงๆ แล้วมีรายละเอียดหลายอย่างที่ช่วยให้งานเลี้ยงออกมาสมบูรณ์แบบยิ่งขึ้น ทีมงาน Siri Bakery รวบรวมหลักการง่ายๆ มาฝากกันครับ

เริ่มจากจำนวนแขกในงาน
เค้กขนาด 6 นิ้วเหมาะกับงานเล็กๆ ไม่เกิน 6-8 คน ส่วนขนาด 8 นิ้วรองรับได้ประมาณ 12-15 คน หากงานใหญ่กว่านั้นแนะนำให้สั่งเป็นเค้กสองชั้น (tier cake) หรือสั่งเค้กหลายก้อนแยกรสชาติ จะได้ทั้งความสวยงามและมีตัวเลือกให้แขกหลากหลายขึ้น

พิจารณารสชาติที่คนส่วนใหญ่ชอบ
หากไม่รู้ความชอบของแขกทุกคน แนะนำให้เลือกรสชาติที่เป็นที่นิยมในวงกว้าง เช่น ช็อกโกแลต วานิลลา หรือใบเตย เพราะมีโอกาสถูกใจคนหมู่มากมากกว่ารสที่มีเอกลักษณ์จัด เช่น ทุเรียนหรือชาเขียวเข้มข้น ถ้าอยากเผื่อความหลากหลาย ลองเลือกเค้กที่มีไส้และหน้าเค้กต่างรสกันในก้อนเดียว

ใส่ใจเรื่องการแพ้อาหาร
ก่อนสั่งควรถามเจ้าภาพหรือแขกคนสำคัญว่ามีคนแพ้ถั่ว นม หรือกลูเตนหรือไม่ ร้านเบเกอรี่ที่ดีมักมีตัวเลือกเค้กสำหรับคนแพ้อาหารเฉพาะทางให้เลือกด้วย การเตรียมพร้อมเรื่องนี้ล่วงหน้าช่วยให้ทุกคนในงานได้อร่อยไปพร้อมกันโดยไม่มีใครถูกทิ้งไว้ข้างหลัง

ดีไซน์หน้าเค้กให้เข้ากับธีมงาน
ถ้างานมีธีมสีหรือคอนเซปต์ชัดเจน เช่น งานวันเกิดเด็ก งานเลี้ยงเกษียณ หรืองานฉลองความสำเร็จ ลองแจ้งร้านล่วงหน้าอย่างน้อย 2-3 วัน เพื่อให้ทีมตกแต่งเค้กมีเวลาออกแบบให้เข้ากับธีมได้อย่างสวยงาม การเขียนข้อความอวยพรบนเค้กก็ควรสั้น กระชับ อ่านง่าย จะดูเรียบร้อยกว่าข้อความยาวเกินไป

อย่าลืมเรื่องเวลาส่งมอบ
เค้กสดที่ไม่มีสารกันบูดควรรับหรือจัดส่งในวันที่จะใช้งานเลย ไม่ควรสั่งล่วงหน้าเกิน 1 วัน เพื่อให้ได้รสชาติและความสดใหม่ที่ดีที่สุด และควรเผื่อเวลาขนส่งหรือเดินทางเพื่อป้องกันเค้กเสียรูปทรงก่อนถึงงาน

หวังว่าหลักการเหล่านี้จะช่วยให้การเลือกเค้กวันเกิดครั้งต่อไปของทุกคนง่ายขึ้น และทำให้วันพิเศษนั้นสมบูรณ์แบบยิ่งขึ้นครับ`,
    },
    {
      id: 'seed-blog-sourdough',
      title: 'รู้จักซาวร์โดว์: ทำไมขนมปังหมักธรรมชาติถึงพิเศษกว่าที่คิด',
      slug: 'get-to-know-sourdough-bread',
      coverImage: commonsImage('Homemade Sourdough 2020.jpg'),
      excerpt: 'ซาวร์โดว์ไม่ได้มีดีแค่รสเปรี้ยวอมหวานเฉพาะตัว แต่เบื้องหลังกระบวนการหมักธรรมชาตินั้นน่าสนใจกว่าที่หลายคนคิด',
      content: `ในบรรดาขนมปังทุกชนิดที่ Siri Bakery อบขาย ซาวร์โดว์ (Sourdough) ถือเป็นเมนูที่ใช้เวลาและความใส่ใจมากที่สุด วันนี้เราอยากพาทุกคนไปทำความรู้จักกับขนมปังหมักธรรมชาตินี้ให้มากขึ้น

ซาวร์โดว์คืออะไร
ต่างจากขนมปังทั่วไปที่ใช้ยีสต์สำเร็จรูปช่วยให้แป้งขึ้นฟู ซาวร์โดว์ใช้ "หัวเชื้อธรรมชาติ" (starter) ที่เกิดจากการหมักแป้งกับน้ำทิ้งไว้จนจุลินทรีย์ป่าและยีสต์ธรรมชาติในอากาศเข้ามาอาศัยอยู่ กระบวนการนี้ต้องใช้เวลาหลายวันในการเลี้ยงหัวเชื้อให้แข็งแรงก่อนนำไปทำขนมปังได้จริง

ทำไมรสชาติถึงเปรี้ยวอมหวานเฉพาะตัว
ระหว่างการหมัก แบคทีเรียกลุ่มแลคโตบาซิลลัสในหัวเชื้อจะผลิตกรดแลคติกและกรดอะซิติกออกมา ซึ่งเป็นตัวการที่ทำให้ซาวร์โดว์มีรสเปรี้ยวอ่อนๆ ที่เป็นเอกลักษณ์ ยิ่งหมักนานเท่าไหร่ รสเปรี้ยวก็จะยิ่งเด่นชัดขึ้นเท่านั้น ทำให้แต่ละร้านมีรสชาติซาวร์โดว์ที่ไม่เหมือนกันเลย ขึ้นอยู่กับอายุและวิธีเลี้ยงหัวเชื้อของแต่ละที่

ข้อดีด้านการย่อยที่หลายคนไม่รู้
กระบวนการหมักที่ยาวนานของซาวร์โดว์ช่วยย่อยสลายกลูเตนและสารต้านโภชนาการบางส่วนในแป้งไปแล้วบางส่วนก่อนถึงมือผู้กิน ทำให้หลายคนที่มักรู้สึกแน่นท้องหลังกินขนมปังทั่วไป กลับพบว่ากินซาวร์โดว์แล้วสบายท้องกว่า นอกจากนี้ค่าดัชนีน้ำตาล (glycemic index) ของซาวร์โดว์ยังต่ำกว่าขนมปังขาวทั่วไปอีกด้วย

เนื้อสัมผัสที่เป็นเอกลักษณ์
ซาวร์โดว์แท้จะมีเปลือกนอกกรอบหนา (crust) ตัดกับเนื้อในที่ชื้นเหนียวและมีรูอากาศขนาดไม่เท่ากันกระจายอยู่ทั่วก้อน (open crumb) ลักษณะนี้เกิดจากกระบวนการนวดและพับแป้งหลายรอบ ประกอบกับเวลาหมักที่นานกว่าขนมปังทั่วไปหลายเท่าตัว

วิธีเพลิดเพลินกับซาวร์โดว์ให้อร่อยที่สุด
แนะนำให้ปิ้งเบาๆ ก่อนทาเนยสดหรือน้ำมันมะกอกคุณภาพดี เพื่อดึงกลิ่นหอมของเปลือกขนมปังออกมาเต็มที่ หรือจะจิ้มกับซุปข้นก็เข้ากันดี เพราะเนื้อขนมปังที่แน่นจะดูดซับน้ำซุปได้ดีโดยไม่ยุ่ยง่าย

ครั้งหน้าถ้าแวะมาที่ Siri Bakery อย่าลืมลองซาวร์โดว์ของเราดูนะครับ แล้วจะรู้ว่าทำไมขนมปังก้อนนี้ถึงคุ้มค่ากับเวลาที่เราใช้ในการหมักทุกขั้นตอน`,
    },
  ]

  for (const { id, ...data } of blogPosts) {
    await prisma.blogPost.upsert({
      where: { id },
      update: { ...data, isPublished: true },
      create: { id, ...data, isPublished: true },
    })
  }
  console.log(`✓ Blog posts: ${blogPosts.length} items`)

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
