import { Button } from "@/components/ui/button";
import Logo from "@/assets/icons/Logo";
import { Link } from "react-router";

export default function HeroSection() {
  
  
  return (
    <section className="relative overflow-hidden py-32 min-h-screen">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
        />
      </div>
      <div className="relative z-10 container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
              <Logo />
            </div>
            <div>
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                Ready to book a{" "}
                <span className="text-red-800">Ride?</span>
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                Your journey begins here. Enjoy quality transfers tailored to your schedule—fast, secure, and hassle-free.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
                <Button className="font-extrabold border-2 border-black hover:text-black hover:bg-red-900">
                  <Link to={"/rider/request"}>Book Ride</Link>
                </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}