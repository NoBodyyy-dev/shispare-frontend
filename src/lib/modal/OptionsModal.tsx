import styles from "./modal.module.sass"
import {FC, ReactNode} from "react";

type Props = {
    name: string;
    children: ReactNode;
}

export const OptionsModal: FC<Props> = (props: Props) => {
    return <div>


        <div>
            {props.children}
        </div>
    </div>
}