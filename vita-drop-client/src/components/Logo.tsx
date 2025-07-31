import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  href?: string;
}

export default function Logo({
  size = 40,
  className = "",
  showText = true,
  href = "/",
}: LogoProps) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity focus:outline-none  rounded-md ${className}`}
      aria-label="VitaDrop - Go to homepage"
    >
      <div className="relative">
        <Image
          src="/logo.png"
          alt="VitaDrop Logo"
          width={size}
          height={size}
          className="rounded-full shadow-sm"
          priority
        />
      </div>
      {showText && <span className="hidden sm:inline-block">VitaDrop</span>}
    </Link>
  );
}
