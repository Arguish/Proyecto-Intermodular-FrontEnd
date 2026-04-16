import React from 'react';
import DinoGame from '../components/DinoGame';

export default function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Oops! Página no encontrada</h1>
            <p className="text-lg text-gray-600 mb-8">Parece que te has perdido. ¡Juega un poco mientras tanto!</p>
            <DinoGame />
        </div>
    );
}