import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 dark:bg-gradient-to-br">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Join the chat and start creating rooms instantly.</p>
        </div>
        <div className="flex items-center justify-center">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
