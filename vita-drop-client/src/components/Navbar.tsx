import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./Themetoggle";

export default function Navbar() {
  return (
    <div className="bg-base-100 w-full">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Logo />
        <ul className="flex space-x-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/register">Register</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
        <ThemeToggle />
      </nav>
    </div>
  );
}
