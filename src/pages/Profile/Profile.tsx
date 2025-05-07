import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import {
  FiUser,
  FiLock,
  FiEdit,
  FiUpload,
  FiEye,
  FiEyeOff,
  FiSave,
} from "react-icons/fi";
import {
  Button,
  Card,
  Label,
  TextInput,
  Textarea,
  ToggleSwitch,
  Avatar,
} from "flowbite-react";
import { useNavigate, useParams } from "react-router";
import userService from "../../services/userSevice";
import { useToast } from "../../hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import authService from "../Auth/services/authService";
import { useAuth } from "../../hooks/useAuth";

interface User {
  _id: string;
  fullName: string;
  email: string;
  account: string;
  avatarUrl: string | null;
}

interface Profile {
  userId: string;
  bio: string;
  dateOfBirth: string | null;
  phoneNumber: string;
  isPublic: boolean;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function Profile() {
  const { id } = useParams();
  const { user: currentUser, setUser: setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  // Avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  // Profile
  const [profile, setProfile] = useState<Profile>({
    userId: id || "",
    bio: "",
    dateOfBirth: null,
    phoneNumber: "",
    isPublic: false,
  });
  // Change password
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  // Show password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (currentUser?.id !== id) {
      navigate("/access-denied");
    }
  }, [id, currentUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (id) {
          const userData = await userService.getUserById(id);
          setUser(userData);

          const userProfile = await userService.getUserProfileByUserId(id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!profile) return;

    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleIsPublicChange = (checked: boolean) => {
    if (!profile) return;

    setProfile({
      ...profile,
      isPublic: checked,
    });
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;

    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const saveProfile = useMutation({
    mutationFn: async () => {
      if (!user || !profile) return;

      try {
        // Handle upload avatar nếu có file được chọn
        if (avatarFile) {
          const uploadAvatarRes = await userService.uploadUserAvatar(
            avatarFile
          );
          setCurrentUser((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              avatarUrl: uploadAvatarRes.avatarUrl,
            };
          });
        }

        // Update user info
        const updatedUser = await userService.updateUser(user);
        setCurrentUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
          };
        });

        // Update profile info
        await userService.updateUserProfile(profile);
        showToast("success", "Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error);
        showToast("error", "Failed to update profile");
      }
    },
    onError: () => {
      showToast("error", "Failed to update profile");
    },
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        showToast("warning", "New passwords do not match");
        return;
      } else {
        const response = await authService.changePassword(
          passwordData.currentPassword,
          passwordData.newPassword
        );
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        showToast("success", "Password changed successfully");
      }
    },
    onError: () => {
      showToast("error", "Failed to change password");
    },
  });

  return (
    <div className="container mx-auto py-8 px-10 xl:px-4 max-w-4xl">
      <h1 className="text-4xl gradient-text font-semibold font-degular mb-6">
        Profile Settings
      </h1>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-purple-100 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              `w-full py-3 text-sm font-medium leading-5 rounded-lg
            ${
              selected
                ? "bg-purple-600 text-white shadow"
                : "text-purple-700 hover:bg-purple-200"
            }`
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <FiUser />
              <span>Personal Information</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-3 text-sm font-medium leading-5 rounded-lg
            ${
              selected
                ? "bg-purple-600 text-white shadow"
                : "text-purple-700 hover:bg-purple-200"
            }`
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <FiLock />
              <span>Change Password</span>
            </div>
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <Card className="mb-6 px-8">
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                Personal Information
              </h2>

              <div className="flex flex-col md:flex-row gap-14">
                <div className="flex flex-col items-center">
                  <div className="mb-4 relative">
                    <Avatar
                      size="xl"
                      img={avatarPreview || user?.avatarUrl || undefined}
                      alt="User avatar"
                      rounded
                      className="!object-cover"
                    />
                    <button
                      className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 text-white hover:bg-purple-700"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                    >
                      <FiEdit size={16} />
                    </button>
                    <input
                      id="avatar-upload"
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <Button
                    color="purple"
                    size="sm"
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                  >
                    <div className="flex items-center justify-center">
                      <FiUpload className="mr-2" />{" "}
                    </div>
                    Upload Avatar
                  </Button>
                </div>

                <div className="flex-1">
                  <div className="grid gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="fullName" value="Full Name" />
                      <TextInput
                        id="fullName"
                        name="fullName"
                        value={user?.fullName || ""}
                        onChange={handleUserChange}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="email" value="Email" />
                      <TextInput
                        id="email"
                        name="email"
                        type="email"
                        value={user?.email || ""}
                        onChange={handleUserChange}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="account" value="Account" />
                      <TextInput
                        id="account"
                        name="account"
                        value={user?.account || ""}
                        disabled
                        helperText="Account cannot be changed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-purple-700 mb-4">
                Profile Details
              </h3>
              <div className="grid gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="bio" value="Bio" />
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile?.bio}
                    onChange={handleProfileChange}
                    rows={4}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="dateOfBirth" value="Date of Birth" />
                  <TextInput
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={
                      profile?.dateOfBirth
                        ? new Date(profile.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="phoneNumber" value="Phone Number" />
                  <TextInput
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profile?.phoneNumber}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <ToggleSwitch
                    color="purple"
                    checked={profile?.isPublic ?? false}
                    onChange={handleIsPublicChange}
                    label="Make profile public"
                  />
                  <span className="text-sm text-gray-500">
                    {profile?.isPublic
                      ? "Your profile is visible to everyone"
                      : "Your profile is private"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  color="purple"
                  isProcessing={saveProfile.isPending}
                  onClick={() => saveProfile.mutate()}
                >
                  <div className="flex items-center justify-center">
                    <FiSave className="mr-2" />
                  </div>{" "}
                  Save Changes
                </Button>
              </div>
            </Card>
          </Tab.Panel>

          <Tab.Panel>
            <Card className="px-8">
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                Change Password
              </h2>
              <div className="grid gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="currentPassword" value="Current Password" />
                  <div className="relative">
                    <TextInput
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {!showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="newPassword" value="New Password" />
                  <div className="relative">
                    <TextInput
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {!showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="confirmPassword"
                    value="Confirm New Password"
                  />
                  <div className="relative">
                    <TextInput
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {!showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  color="purple"
                  isProcessing={changePassword.isPending}
                  onClick={() => changePassword.mutate()}
                >
                  <div className="flex items-center justify-center">
                    <FiSave className="mr-2" />
                  </div>
                  Change Password
                </Button>
              </div>
            </Card>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default Profile;
