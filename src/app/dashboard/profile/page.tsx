"use client";

import { useState } from "react";
import { Edit3, RefreshCw, User, Mail, Fingerprint, Shield, Phone, MapPin, BookOpen, Calendar, Clock, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import ProfileForm from "@/components/profile/ProfileForm";
import { ProfileDetailItem } from "@/components/profile/ProfileDetailItem";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";
import { useProfile } from "@/hooks/useProfile";
import { formatDateTime, formatRole } from "@/lib/format";
import type { ProfileFormData } from "@/schemas/profile.schema";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function toProfileFormData(profile: NonNullable<ReturnType<typeof useProfile>["profile"]>): ProfileFormData {
  return {
    name: profile.name || "",
    phone: profile.phone || "",
    avatar: profile.avatar || "",
    address: profile.address || "",
    bio: profile.bio || "",
  };
}

export default function ProfilePage() {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile();
  const authUser = useAuthStore((state) => state.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(true);
      toast.success("User ID copied to clipboard");
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      toast.error("Failed to copy User ID");
    }
  };

  const displayProfile = profile ?? authUser;

  const handleProfileSubmit = async (data: ProfileFormData) => {
    const response = await updateProfile(data);
    return { message: response.message };
  };

  const handleProfileUpdated = () => {
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">Loading profile...</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full max-w-md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !displayProfile) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Unable to load profile</CardTitle>
          <CardDescription>
            {error || "Profile data is unavailable."}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => void fetchProfile()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-24 w-24 border border-border/60">
            <AvatarImage
              src={displayProfile.avatar}
              alt={displayProfile.name}
            />
            <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-3xl text-white">
              {displayProfile.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl text-white">
                {displayProfile.name}
              </h1>
              <Badge variant="secondary" className="badge-gaming">{formatRole(displayProfile.role)}</Badge>
            </div>
            <p className="text-neutral-400 text-sm">{displayProfile.email}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-2 sm:grid-cols-3 bg-background/20 border border-border/40 p-1.5 rounded-xl">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">Profile Information</TabsTrigger>
          <TabsTrigger value="password" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">Change Password</TabsTrigger>
          <TabsTrigger value="delete" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">Delete Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white font-bold">Account Details</CardTitle>
              <CardDescription className="text-neutral-400">
                View and manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <ProfileDetailItem
                  label="Name"
                  value={displayProfile.name || "Not set"}
                  icon={<User className="size-5" />}
                />
                <ProfileDetailItem
                  label="Email"
                  value={displayProfile.email || "Not set"}
                  icon={<Mail className="size-5" />}
                />
                <ProfileDetailItem
                  label="User ID"
                  value={
                    <div className="flex items-center justify-between gap-2 group/copy w-full">
                      <span className="font-mono text-sm tracking-tight text-white select-all">
                        {displayProfile._id}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopyId(displayProfile._id)}
                        className="size-7 rounded-md hover:bg-white/10 hover:text-white text-neutral-400 opacity-60 group-hover/copy:opacity-100 transition-opacity"
                        title="Copy User ID"
                      >
                        {copiedId ? (
                          <Check className="size-3.5 text-green-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  }
                  icon={<Fingerprint className="size-5" />}
                />
                <ProfileDetailItem
                  label="Role"
                  value={
                    <Badge variant="outline" className="border-border/80 bg-white/5">
                      {formatRole(displayProfile.role)}
                    </Badge>
                  }
                  icon={<Shield className="size-5" />}
                />
                <ProfileDetailItem
                  label="Phone"
                  value={displayProfile.phone || "Not set"}
                  icon={<Phone className="size-5" />}
                />
                <ProfileDetailItem
                  label="Address"
                  value={displayProfile.address || "Not set"}
                  icon={<MapPin className="size-5" />}
                />
                <ProfileDetailItem
                  label="Bio"
                  value={displayProfile.bio || "Not set"}
                  icon={<BookOpen className="size-5" />}
                  className="md:col-span-2"
                />
                <ProfileDetailItem
                  label="Member Since"
                  value={formatDateTime(displayProfile.createdAt)}
                  icon={<Calendar className="size-5" />}
                />
                <ProfileDetailItem
                  label="Last Updated"
                  value={formatDateTime(displayProfile.updatedAt)}
                  icon={<Clock className="size-5" />}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-gaming bg-primary hover:bg-primary/95 text-white font-semibold px-4 py-2 shadow-md shadow-red-900/10 gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-border/45 max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-white font-bold text-lg">Edit Profile</DialogTitle>
                    <DialogDescription className="text-neutral-400 text-sm mt-1">
                      Update your personal information and profile image.
                    </DialogDescription>
                  </DialogHeader>
                  {isDialogOpen && (
                    <ProfileForm
                      defaultValues={toProfileFormData(displayProfile)}
                      onSubmit={handleProfileSubmit}
                      onSuccess={handleProfileUpdated}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white font-bold">Change Password</CardTitle>
              <CardDescription className="text-neutral-400">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delete" className="mt-6">
          <DeleteAccountButton />
        </TabsContent>
      </Tabs>
    </div>
  );
}
