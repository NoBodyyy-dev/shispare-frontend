import {ISolutionDetail} from "../../store/interfaces/solution.interface.ts";
import {MiniProductCard} from "../../lib/products/MiniProductCard.tsx";

type Props = {
    detail: ISolutionDetail
    index: number
}

export const SolutionItem = (props: Props) => {
    return <div className="flex">
        <span>{props.index}.</span>
        <h2 className="subtitle">{props.detail.section}</h2>
        {props.detail.products.map(product => (
            <MiniProductCard product={product}/>
        ))}
    </div>
}