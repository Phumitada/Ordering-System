import logoSrc from '@/assets/siri-logo.png'

const Logo = ({ className = 'h-12 w-auto' }: { className?: string }) => {
  return <img src={logoSrc} alt="Siri Bakery Logo" className={`object-contain ${className}`} />
}

export default Logo
