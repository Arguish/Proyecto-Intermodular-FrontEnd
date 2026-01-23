import { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Login attempt:', { email, password })
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="card max-w-md w-full">
                <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
                    Iniciar Sesión
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                    <Button variant="primary" className="w-full" type="submit">
                        Entrar
                    </Button>
                </form>
            </div>
        </div>
    )
}
