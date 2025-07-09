import {PushMessageList} from "../lib/message/PushMessage.tsx";
import {Header} from "../lib/header/Header.tsx";
import {Outlet} from "react-router-dom";
import Footer from "../lib/footer/Footer.tsx";

export const UserLayout = () => {
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
