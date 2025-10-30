import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { login } from '../services/auth.api'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

const LoginPage = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setUser } = useAuthContext();
    const navigate = useNavigate();

    const handleLogin = async (e:React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await login({ username, password });
            if (response.status === 'success') {
                sessionStorage.setItem("access_token",response.access_token);
                sessionStorage.setItem("user",username);
                setUser(username);
                navigate("/dashboard");
                return;
            }
            setError("Invalid credentials");
            setTimeout(() => {
                setError('');
            }, 3000);
        } catch (error) {
            console.error(error);
            setError("Something wrong! Please try again later.");
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    }

    return <>
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full p-4 sm:w-sm">
                <div className={cn('flex flex-col gap-6')}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Kverse Data Tool</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            type="username"
                                            placeholder="John Doe"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center flex-wrap">
                                            <Label htmlFor="password">Password</Label>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    {error && <p className="text-sm text-red-500">{error}</p>}
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </>
}

export default LoginPage;