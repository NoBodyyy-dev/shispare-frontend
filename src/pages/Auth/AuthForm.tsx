import { MainInput } from "../../lib/input/MainInput.tsx";
import { ChangeEvent } from "react";

type Data = { email: string; password: string };

type Props = {
    data: Data;
    setData: (authData: Data) => void;
    errors?: Record<string, string[]>;
};

export const AuthForm = (props: Props) => {
    return (
        <>
            <h2 className="subtitle mb-15 center">Войти</h2>
            <div className="flex-col gap-8">
                <MainInput
                    label="Электронная почта"
                    value={props.data.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        props.setData({ ...props.data, email: e.target.value })
                    }
                    inputMode="email"
                    placeholder="name@example.com"
                    error={props.errors?.email}
                />

                <MainInput
                    type="password"
                    label="Пароль"
                    value={props.data.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        props.setData({ ...props.data, password: e.target.value })
                    }
                    placeholder="Введите пароль"
                    error={props.errors?.password}
                />
            </div>
        </>
    );
};