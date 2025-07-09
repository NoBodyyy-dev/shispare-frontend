import {PushMessageList} from "../lib/message/PushMessage.tsx";
import {Outlet} from "react-router-dom";

export const UserOnlyBodyLayout = () => {
    return (
        <>
            <PushMessageList/>
            <main className="main full-height flex-to-center-col">
                <Outlet/>
            </main>
        </>
    );
};
