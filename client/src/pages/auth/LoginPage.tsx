import { SignIn } from '@clerk/react'

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <SignIn routing="path" path="/login" signUpUrl="/signup" forceRedirectUrl="/portal" />
    </div>
  )
}
