import {Link} from "react-router-dom";

export default function HeaderCatalog() {
    return (
        <Link to="/categories">
            <div className="header__catalog flex-align-center-sbetw">
                <div className="header__catalog-lines gap-3">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <span>Каталог</span>
            </div>
        </Link>
    );
}
