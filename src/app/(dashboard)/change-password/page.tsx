import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="max-w-xl p-6">
      <h1 className="text-3xl font-bold mb-6">
        Change Password
      </h1>

      <ChangePasswordForm />
    </div>
  );
}