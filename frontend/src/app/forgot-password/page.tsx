import { resetPassword } from './actions'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const message = resolvedSearchParams?.message;
  const error = resolvedSearchParams?.error;

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
      <Link href="/login" className="absolute top-8 left-8 text-sm font-medium hover:text-primary transition-colors">
        &larr; Back to login
      </Link>
      
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Reset Password
          </CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <form action={resetPassword}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-primary/15 text-primary text-sm p-3 rounded-md border border-primary/20">
                {message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <button type="submit" className={cn(buttonVariants({ variant: "default" }), "w-full")}>
              Send Reset Link
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
