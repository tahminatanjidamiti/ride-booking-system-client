import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import config from "@/config";
import { cn } from "@/lib/utils";
import { useLoginMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
    email: "",
    password: "",
  },});
  const [login] = useLoginMutation();

  const location = useLocation();
  const { refetch } = useUserInfoQuery(undefined);
  const redirect = (location.state as { from?: string })?.from || "/";


  const fillCredentials = (role: "ADMIN" | "RIDER" | "DRIVER") => {
    const credentials = {
      ADMIN: { email: "admin@gmail.com", password: "@A123456" },
      RIDER: { email: "mity2027@gmail.com", password: "@A123456" },
      DRIVER: { email: "tahminatanjidamiti@gmail.com", password: "@A123456" },
    };

    form.setValue("email", credentials[role].email);
    form.setValue("password", credentials[role].password);
  };


  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await login(data).unwrap();

      if (res.success) {
        toast.success("Logged in successfully");

        await refetch();
        navigate(redirect, { replace: true, state: { email: data.email } });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // console.error(err);

      if (err.data.message === "Password does not match") {
        toast.error("Invalid credentials");
      }

      if (err.data.message === "User is not verified") {
        toast.error("Your account is not verified");
        navigate("/verify", { state: data.email });
      }
    }
  };

  const handleGoogleLogin = () => {
    window.open(`${config.baseUrl}/auth/google?redirect=${redirect}`);
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <div className="flex gap-2 mb-2 ml-10">
            <Button className="bg-amber-800 hover:bg-amber-700 text-white border-2 border-black" onClick={() => fillCredentials('ADMIN')}>Admin</Button>
            <Button className="bg-amber-800 hover:bg-amber-700 text-white border-2 border-black" onClick={() => fillCredentials('RIDER')}>Rider</Button>
            <Button className="bg-amber-800 hover:bg-amber-700 text-white border-2 border-black" onClick={() => fillCredentials('DRIVER')}>Driver</Button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} value={field.value || ""} />
                  </FormControl>
                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forget password?
                    </Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full border-2 border-black">
              Login
            </Button>
          </form>
        </Form>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <Button
          onClick={handleGoogleLogin}
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
        >
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" replace className="underline underline-offset-4">
          Register
        </Link>
      </div>
    </div>
  );
}