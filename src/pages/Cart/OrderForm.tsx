import {MainInput} from "../../lib/input/MainInput.tsx";

// type Props = {
//     address: string,
//     setAddress: (address: string) => void,
// }

export const OrderForm = () => {
    return (
        <div>
            <MainInput placeholder={"Адрес"} value={""}/>
        </div>
    );
};