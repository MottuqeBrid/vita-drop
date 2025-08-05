export default function SuspendedPage() {
  return (
    <div>
      <h1>Your account is suspended</h1>
      <p>
        Your account has been suspended. Please contact support for more
        information.
      </p>
    </div>
  );
}

export const metadata = {
  title: "Suspended",
  description: "Your account has been suspended.",
};
