import { useForgotPasswordMutation } from "@/redux/features/auth/auth.api";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [forgotPassword] = useForgotPasswordMutation();
    const form = useForm<{ email: string }>({ defaultValues: { email: "" } });

    const onSubmit = async (data: { email: string }) => {
        try {
            const res = await forgotPassword(data).unwrap();
            if (res.success) {
                toast.success("Password reset link sent to your email");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Forgot password error:", err);
            toast.error(err?.data?.message || err?.message || "Something went wrong");
        }
    };

    return (
        <div className="mt-8 max-w-md mx-auto space-y-6">
            <h2 className="text-xl font-bold">Forgot Password</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    {...form.register("email", { required: true })}
                />
                <Button type="submit" className="w-full">Send Reset Link</Button>
            </form>
        </div>
    );
}
