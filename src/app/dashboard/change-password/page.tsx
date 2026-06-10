import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Change Password</h1>
        <p className="text-muted-foreground mt-2">
          Update your password to keep your account secure
        </p>
      </div>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Change Your Password</CardTitle>
          <CardDescription>
            Enter your current password and a new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}