import SplitScreen from '@/layout/SplitScreen'
import AuthPanel from '@/components/auth/AuthPanel'

const LeftSideShowcase = () => (
  <div className="w-full h-full relative overflow-hidden flex items-end pb-20 px-10">
    <img
      src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop"
      alt="Bakery Background"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
    <div className="relative z-10 text-white max-w-lg animate-fade-in-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-1 w-12 bg-secondary rounded-full"></div>
        <span className="text-secondary font-bold tracking-wider text-sm uppercase">Siri Bakery System</span>
      </div>
      <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6 leading-normal drop-shadow-md">
        ความใส่ใจ...
        <br className="hidden lg:block" />
        <span className="mt-2 block">ในทุกขั้นตอน</span>
      </h1>
      <p className="text-white/80 font-light text-lg">
        ระบบจัดการร้านที่ช่วยให้คุณส่งต่อความอร่อย
        <br />
        ได้ง่ายและมีประสิทธิภาพที่สุด
      </p>
    </div>
  </div>
)

const Login = () => {
  return <SplitScreen left={<LeftSideShowcase />} right={<AuthPanel />} />
}

export default Login
