/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/features/auth/auth.api";

export default function ResetPasswordPage() {
  const [resetPassword] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const form = useForm<{ newPassword: string }>({
    defaultValues: { newPassword: "" },
  });

  const onSubmit = async (data: { newPassword: string }) => {
    if (!id || !token) {
      toast.error("Invalid or expired reset link");
      return;
    }

    try {
      const res = await resetPassword({
        id,
        token,
        newPassword: data.newPassword,
      }).unwrap();

      if (res.success) {
        toast.success("Password reset successful. Please login.");
        navigate("/login", { replace: true });
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="mt-8 max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold">Reset Password</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="password"
          placeholder="Enter new password"
          {...form.register("newPassword", { required: true })}
        />
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    </div>
  );
}