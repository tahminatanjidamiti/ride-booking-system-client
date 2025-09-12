import { useSearchParams, Link } from "react-router";

export default function Success() {
  const [sp] = useSearchParams();
  const status = sp.get("status");
  const tx = sp.get("transactionId");
  const amount = sp.get("amount");
  const message = sp.get("message");
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-xl font-semibold">Payment {status}</h1>
      <div>Transaction: {tx}</div>
      <div>Amount: {amount}</div>
      <div>Message: {message}</div>
      <Link to="/" className="text-blue-600">Go home</Link>
    </div>
  );
}