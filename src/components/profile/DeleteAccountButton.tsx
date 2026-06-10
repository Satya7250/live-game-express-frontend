"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";

import { deleteAccountSchema, type DeleteAccountFormData } from "@/schemas/profile.schema";
import * as userService from "@/services/user";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      setError("");

      await userService.deleteAccount(data);
      
      // Log the user out and redirect to home
      logout();
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Account deletion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader className="space-y-1">
        <CardTitle className="text-destructive">Delete Account</CardTitle>
        <CardDescription>
          Once you delete your account, there is no going back. Please be certain.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="delete-password">Enter your password to confirm</Label>
            <Input
              id="delete-password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={loading}
            className="gap-2"
          >
            <Trash2 className="size-4" />
            {loading ? "Deleting..." : "Delete Account"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
