import Footer from "./lib/footer/Footer.tsx";
import Header from "./lib/header/Header.tsx";
import {Outlet, useLocation} from "react-router-dom";
import PushMessageList from "./lib/message/PushMessage.tsx";

const changeLayoutPaths = ["/notFound", "/auth"];

const Layout = () => {
    const location = useLocation();

    if (changeLayoutPaths.includes(location.pathname)) return <>
        <PushMessageList/>
        <main className="main full-height flex-to-center-col">
            <Outlet/>
        </main>
    </>

    return (
        <>
            <PushMessageList/>
            <Header/>
            <main className="main">
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
};

export default Layout;
