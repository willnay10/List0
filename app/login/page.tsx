export const runtime = 'edge'

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const handleSignUp = async () => {
        setLoading(true)
        setError(null)
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) {
            setError(error.message)
        } else {
            setError('Check your email for the confirmation link.')
        }
        setLoading(false)
    }

    const handleSignIn = async () => {
        setLoading(true)
        setError(null)
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            setError(error.message)
        } else {
            window.location.href = '/dashboard'
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center p-4">
            <Card className="w-full max-w-md border-none shadow-2xl bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Sign in or sign up</CardTitle>
                    <CardDescription className="text-center">
                        Use email and password. Your session stays active until you sign out.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="bg-background/50"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="bg-background/50"
                        />
                    </div>
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                    <div className="flex flex-col gap-2">
                        <Button onClick={handleSignIn} disabled={loading} className="w-full">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Sign In
                        </Button>
                        <Button
                            onClick={handleSignUp}
                            disabled={loading}
                            variant="outline"
                            className="w-full bg-background/50"
                        >
                            Sign Up
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
