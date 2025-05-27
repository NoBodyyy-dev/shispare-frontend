import {MainInput} from "../../lib/input/MainInput.tsx";

export default function AuthForm() {
    return (
        <>
            <h2 className="subtitle mb-25 center">Войти</h2>
            <div className="flex-col gap-10" style={{border: "1px solid #000"}}>
                <MainInput className="full-width" placeholder="Номер телефона"/>
                <MainInput className="full-width" placeholder="Email"/>
            </div>
        </>
    );
};
