import {Button} from "../buttons/Button.tsx";
import {useAuth} from "../../context/AuthContext.tsx";
import {Dispatch, memo, ReactNode, SetStateAction} from "react";
import styles from "./title.module.sass"

type Props = {
    title: string,
    openModal?: Dispatch<SetStateAction<boolean>>;
    customButton?: ReactNode;
}

export const TitleWithCreateButton = memo((props: Props) => {
    const {isAuthenticated, user} = useAuth();

    if (isAuthenticated && user?.role === "Admin") {
        return (
            <div className="flex-align-start-sbetw">
                <h1 className="title mb-20">{props.title}</h1>
                {props.customButton ? (
                    props.customButton
                ) : props.openModal ? (
                    <Button
                        className={`${styles.titleButton} fz-20`}
                        onClick={() => props.openModal!(true)}
                    >+</Button>
                ) : null}
            </div>
        );
    }
    return <h1 className="title mb-20">{props.title}</h1>
})