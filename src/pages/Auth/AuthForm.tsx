import {MainInput} from "../../lib/input/MainInput.tsx";
import {ChangeEvent} from "react";

type Data = { email: string, password: string }

type Props = {
    data: Data;
    setData: (authData: Data) => void;
}

export const AuthForm = (props: Props) => {
    return (
        <>
            <h2 className="subtitle mb-25 center">Войти</h2>
            <div className="flex-col gap-10">
                <MainInput
                    value={props.data.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => props.setData({
                        ...props.data,
                        email: e.target.value
                    })}
                    inputMode="email"
                    className="full-width"
                    placeholder="Электронная почта"/>
                <MainInput
                    type="password"
                    value={props.data.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => props.setData({
                        ...props.data,
                        password: e.target.value
                    })}
                    className="full-width"
                    placeholder="Пароль"/>
            </div>
        </>
    );
};
