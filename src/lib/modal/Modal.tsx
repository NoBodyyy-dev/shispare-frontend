import {Dispatch, ReactNode, SetStateAction, useEffect} from "react";
import styles from "./modal.module.sass"

type MODAL_PROPS = {
    children: ReactNode;
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
};

export default function Modal(props: MODAL_PROPS) {
    useEffect(() => {
        if (props.modal)
            document.body.classList.add("fixed-height")
        if (document.body.classList.contains("fixed-height") && !props.modal)
            document.body.classList.remove("fixed-height")
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
