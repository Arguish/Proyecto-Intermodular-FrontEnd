import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout() {
    return (
        <div className="h-screen flex flex-col">
            <Header />

            <main className="flex-1 flex overflow-hidden">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
