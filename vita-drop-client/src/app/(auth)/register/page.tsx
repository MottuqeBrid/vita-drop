import Link from "next/link";

export default function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
      <p>This is the registration page.</p>
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
        Already have an account? <Link href="/login">Login here</Link>.
      </p>
    </div>
  );
}
