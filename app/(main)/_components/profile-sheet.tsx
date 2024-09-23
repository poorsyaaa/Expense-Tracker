import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  Sheet,
  SheetTitle,
} from "@/components/ui/sheet";
import { User } from "lucia";
import { PropsWithChildren, useState } from "react";
import { ProfileForm } from "./forms/profile-form";
import { PasswordSchema, ProfileSchema } from "@/lib/schema/profile";
import { Separator } from "@/components/ui/separator";
import {
  useResetPassword,
  useUpdateProfile,
} from "@/api/mutations/profile-services";
import { PasswordForm } from "./forms/reset-password-form";

interface ProfileSheetProps {
  user: User;
  isOpen: boolean;
  onClose: (invalidate: boolean) => void;
}

export const ProfileSheet: React.FC<PropsWithChildren<ProfileSheetProps>> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [profileFormError, setProfileFormError] = useState<
    string | undefined
  >();
  const [resetFormError, setResetFormError] = useState<string | undefined>(
    undefined,
  );

  const { mutate: updateProfile, isPending: isUpdatePending } =
    useUpdateProfile();
  const { mutate: resetPassword, isPending: isPasswordPending } =
    useResetPassword();

  const onProfileSubmit = (data: ProfileSchema) => {
    updateProfile(
      {
        data,
        endpoint: "/profile",
      },
      {
        onSuccess: () => {
          setProfileFormError(undefined);
          onClose(true);
        },
        onError: (error) => {
          setProfileFormError(error.message);
        },
      },
    );
  };

  const onPasswordSubmit = (data: PasswordSchema) => {
    resetPassword(
      {
        data,
        endpoint: "/profile/reset-password",
      },
      {
        onSuccess: () => {
          setResetFormError(undefined);
          onClose(true);
        },
        onError: (error) => {
          setResetFormError(error.message);
        },
      },
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <ProfileForm
          defaultValues={{
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            // avatarUrl: user.avatarUrl,
          }}
          isPending={isUpdatePending}
          onSubmit={onProfileSubmit}
          formError={profileFormError}
        />
        <Separator className="my-4" />
        <PasswordForm
          isPending={isPasswordPending}
          onSubmit={onPasswordSubmit}
          formError={resetFormError}
        />
      </SheetContent>
    </Sheet>
  );
};
