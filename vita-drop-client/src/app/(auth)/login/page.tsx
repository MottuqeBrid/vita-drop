import Link from "next/link";

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <p>This is the login page.</p>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Already have an account? <Link href="/register">Register here</Link>.
      </p>
    </div>
  );
}
