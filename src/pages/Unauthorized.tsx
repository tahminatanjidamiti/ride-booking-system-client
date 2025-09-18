import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { Link } from "react-router";

export default function Unauthorized() {
  return (
    <div className="flex min-h-svh flex-col justify-center items-center">
      <div className="p-6 border rounded-lg hover:shadow-lg transition space-y-2">
        <h1> You are Unauthorized in this route, Please try with right credentials...</h1>
      <Button className="border-2 border-black">
          <Link to="/" className="text-white flex justify-center items-center gap-2">Go home <HomeIcon/></Link>
        </Button>
      </div>
    </div>
  );
}