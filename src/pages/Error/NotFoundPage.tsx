import {Link} from "react-router-dom";

export const NotFoundPage = () => {
    return (
        <div className="main__container">
            <h1>404 — Страница не найдена</h1>
            <p className="mb-10">К сожалению, такой страницы не существует.</p>
            <Link to="/">Вернуться на главную</Link>
        </div>
    );
};

export default NotFoundPage;

