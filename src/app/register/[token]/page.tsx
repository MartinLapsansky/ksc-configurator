import { getValidInvitation } from "@/lib/invitation";
import RegisterForm from "@/features/auth/components/RegisterForm";

type RegisterPageProps = {
  params: Promise<{ token: string }>;
};

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { token } = await params;

  const invitation = await getValidInvitation(token);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-md sm:p-8">
          <h1 className="mb-3 text-2xl font-bold text-black sm:text-3xl">
            Invitation link is invalid or has expired
          </h1>
          <p className="text-sm text-gray-600">
            Please contact the KCS sales team to request a new invitation.
          </p>
        </div>
      </div>
    );
  }

  return <RegisterForm email={invitation.email} token={token} />;
}