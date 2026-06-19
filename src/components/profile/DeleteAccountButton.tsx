"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  deleteAccountSchema,
  type DeleteAccountFormData,
} from "@/schemas/profile.schema";
import { getApiErrorMessage } from "@/lib/api-error";
import * as userService from "@/services/user";
import { logout as logoutApi } from "@/services/auth";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const onSubmit = async (data: DeleteAccountFormData) => {
    try {
      setLoading(true);

      const response = await userService.deleteAccount(data);

      try {
        await logoutApi();
      } catch {
        // Session may already be invalidated after account deletion.
      }

      logout();
      toast.success(response.message || "Account deleted successfully");
      router.replace("/login");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Account deletion failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-destructive/30 hover:border-destructive/50 hover:transform-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-red-500 font-bold">Delete Account</CardTitle>
        <CardDescription className="text-neutral-400">
          Once you delete your account, there is no going back. Please be certain.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delete-password" className="text-neutral-300 font-medium">
              Enter your password to confirm
            </Label>
            <Input
              id="delete-password"
              type="password"
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
              className="border-white/10 bg-background/30 focus-visible:ring-primary/20"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => reset()}
            className="w-full sm:w-auto font-semibold rounded-lg bg-background/30 hover:bg-background/50 border-white/10 text-neutral-200 transition-all"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={loading}
            className="w-full gap-2 sm:w-auto font-semibold rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0 shadow-sm"
          >
            <Trash2 className="size-4" />
            {loading ? "Deleting account..." : "Delete Account"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
