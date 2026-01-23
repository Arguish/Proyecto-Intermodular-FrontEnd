import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "IES El Rincón - Portal de Reservas",
    description: "Sistema de gestión de material para IES El Rincón",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
