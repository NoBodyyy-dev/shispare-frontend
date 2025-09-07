import {Link, useRouteError} from "react-router-dom";

export const ServerErrorPage = () => {
    const error = useRouteError() as any;
    const message = error?.message || "Внутренняя ошибка сервера";

    return (
        <div className="main__container">
            <h1>500 — Ошибка сервера</h1>
            <p className="mb-10">{message}</p>
            <Link to="/">Вернуться на главную</Link>
        </div>
    );
};

export default ServerErrorPage;

