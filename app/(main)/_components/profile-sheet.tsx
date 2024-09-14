import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  Sheet,
} from "@/components/ui/sheet";
import { User } from "lucia";
import { PropsWithChildren, useState } from "react";
import { ProfileForm } from "./profile-form";
import { ProfileSchema } from "@/lib/schema/profile";
import { Separator } from "@/components/ui/separator";
import { useUpdateProfile } from "@/api/mutations/profile-services";

interface ProfileSheetProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSheet: React.FC<PropsWithChildren<ProfileSheetProps>> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const { mutate: updateProfile, isPending: isUpdatePending } =
    useUpdateProfile();

  const onProfileSubmit = (data: ProfileSchema) => {
    updateProfile(
      {
        data,
        endpoint: "/profile",
      },
      {
        onSuccess: () => {
          setFormError(undefined);
          onClose();
        },
        onError: (error) => {
          setFormError(error.message);
        },
      },
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>Edit Profile</SheetHeader>
        <SheetDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </SheetDescription>
        <div className="grid gap-4 py-4">
          <ProfileForm
            defaultValues={{
              username: user.username,
              displayName: user.displayName,
              email: user.email,
              avatarUrl: user.avatarUrl,
            }}
            isPending={isUpdatePending}
            onSubmit={onProfileSubmit}
            formError={formError}
          />
          <Separator />
        </div>
      </SheetContent>
    </Sheet>
  );
};
