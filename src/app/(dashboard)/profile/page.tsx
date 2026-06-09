"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";

import * as userService from "@/services/user";
import ProfileForm from "@/components/profile/ProfileForm";

import type { UpdateProfileDto } from "@/types/user";

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<UpdateProfileDto | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [isEditing, setIsEditing] =
    useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response =
          await userService.getProfile();

        setProfile(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 flex items-center justify-center">
          <User
            size={28}
            className="text-white"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            Profile
          </h1>

          <p className="text-gray-500">
            Manage your account information
          </p>
        </div>
      </div>

      {!isEditing ? (
        <div className="border rounded-xl p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">
              Name
            </p>

            <p className="font-medium">
              {profile?.name || "Not set"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>

            <p className="font-medium">
              {profile?.phone || "Not set"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Address
            </p>

            <p className="font-medium">
              {profile?.address ||
                "Not set"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Bio
            </p>

            <p className="font-medium">
              {profile?.bio || "Not set"}
            </p>
          </div>

          <button
            onClick={() =>
              setIsEditing(true)
            }
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="border rounded-xl p-6">
          <ProfileForm
            defaultValues={{
              name:
                profile?.name || "",
              phone:
                profile?.phone || "",
              avatar:
                profile?.avatar || "",
              address:
                profile?.address || "",
              bio:
                profile?.bio || "",
            }}
          />

          <button
            onClick={() =>
              setIsEditing(false)
            }
            className="mt-4 px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}