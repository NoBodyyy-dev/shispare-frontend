import {memo} from "react";
import styles from "./solution.module.sass"
import {ISolution} from "../../store/interfaces/solution.interface.ts";
import {Link} from "react-router-dom";

type Props = {
    solution: ISolution
}

export const SolutionPreview = memo((props: Props) => {
    console.log("<<<", props.solution)
    return <Link to={`/solution/${props.solution.slug}`}>
        <div className={styles.container} style={{backgroundImage: props.solution.image}}>
            <img src={props.solution.image}/>
            <div className={styles.dark}>
                <p className={styles.name}>{props.solution.name}</p>
            </div>
        </div>
    </Link>
})