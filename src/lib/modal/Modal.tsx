import {Dispatch, ReactNode, SetStateAction, useEffect} from "react";
import styles from "./modal.module.sass"

type Props = {
    children: ReactNode;
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
};

export const Modal = (props: Props) => {
    useEffect(() => {
        if (props.modal) document.body.classList.add("fixed-height");

        return () => {
            document.body.classList.remove("fixed-height");
        };
    }, [props.modal]);

    return (
        props.modal &&
        <div className={`${styles.modal} full-height flex-to-center`}
             onClick={() => props.setModal(false)}>
            <div className={`${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
                {props.children}
            </div>
        </div>
    );
}
