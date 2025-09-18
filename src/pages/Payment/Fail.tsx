import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { useSearchParams, Link } from "react-router";

export default function Fail() {
  const [sp] = useSearchParams();
    const status = sp.get("status");
    const tx = sp.get("transactionId");
    const amount = sp.get("amount");
    const message = sp.get("message");
    return (
      <div className="flex min-h-svh flex-col justify-center items-center">
        <div className="p-6 border rounded-lg hover:shadow-lg transition space-y-2">
        <h1 className="text-xl font-semibold">Payment {status}</h1>
        <div>Transaction: {tx}</div>
        <div>Amount: {amount}</div>
        <div>Message: {message}</div>
        <Button className="border-2 border-black">
          <Link to="/" className="text-white flex justify-center items-center gap-2">Go home <HomeIcon/></Link>
        </Button>
      </div>
      </div>
    );
}