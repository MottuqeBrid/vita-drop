import Logo from "@/components/Logo";
import ThemeToggle from "@/components/Themetoggle";
import Link from "next/link";

export default function AuthNavbar() {
  return (
    <nav className="flex justify-between items-center p-4">
      <Logo />
      <ul className="flex space-x-4">
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/register">Register</Link>
        </li>
      </ul>
      <ThemeToggle />
    </nav>
  );
}
