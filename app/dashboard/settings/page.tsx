import PasswordResetSection from "@/app/components/settings/PasswordResetSection";
import ProfileForm from "@/app/components/settings/ProfileForm";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

export default async function SettingsPage() {
  const sessionUser = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { name: true, email: true, password: true },
  });

  if (!dbUser) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-small text-default-500">Manage your account preferences.</p>
      </div>

      <div className="flex flex-col gap-6">
        <Card shadow="sm">
          <CardHeader className="px-6 py-5">
            <div>
              <h2 className="text-base font-semibold">Profile</h2>
              <p className="mt-0.5 text-small text-default-500">Update your display name.</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="px-6 py-6">
            <ProfileForm name={dbUser.name ?? ""} email={dbUser.email} />
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardHeader className="px-6 py-5">
            <div>
              <h2 className="text-base font-semibold">Security</h2>
              <p className="mt-0.5 text-small text-default-500">Manage your password.</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="px-6 py-6">
            <PasswordResetSection hasPassword={!!dbUser.password} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
