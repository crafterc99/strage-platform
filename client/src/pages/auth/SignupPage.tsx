import { SignUp } from '@clerk/react'

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <SignUp routing="path" path="/signup" signInUrl="/login" forceRedirectUrl="/portal" />
    </div>
  )
}
