import {useParams} from 'react-router-dom'
import {FC} from "react";

export const OneSolution: FC = () => {
    const params = useParams();
    return (
        <div>OneSolution {params["solution-slug"]}</div>
    )
}
