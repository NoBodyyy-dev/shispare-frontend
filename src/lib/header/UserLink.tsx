import {useAuth} from "../../context/AuthContext.tsx";
import {Link} from "react-router-dom";
import {getInitials} from "../../hooks/util.hook.ts";

export const UserLink = () => {
    const {user} = useAuth()
    const iconName = getInitials(user?.fullName || "")

    if (user?.role === "User") return <Link to={`/lk/${user?._id}`} aria-label="Личный кабинет">
        <div className="header__buttons-button user flex-to-center-col" title={user?.fullName}>
            {iconName}
        </div>
    </Link>

    return <Link to={`/lk/${user?._id}`} aria-label="Личный кабинет">
        <div className="header__buttons-button user flex-to-center-col" title={user?.fullName}>
            {iconName}
        </div>
        <span>{user?.fullName}</span>
    </Link>

}