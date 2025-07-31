import Image from "next/image";
import Link from "next/link";
export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 text-2xl font-bold text-primary"
    >
      <Image src="/logo.png" alt="VitaDrop Logo" width={40} height={40} />
    </Link>
  );
}
