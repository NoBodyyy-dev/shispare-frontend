import {MainInput} from "../../lib/input/MainInput.tsx";
import {ChangeEvent} from "react";
import styles from "./auth.module.sass"
import {RegisterData} from "../../store/interfaces/user.interface.ts";

interface Data extends RegisterData {
    confirmPassword: string;
}

type Props = {
    data: Data;
    setData: (authData: Data) => void;
}

export const RegisterForm = (props: Props) => {
    const checkIND = props.data.type === "IND"

    const INDComponent = <>
        <MainInput
            value={props.data.fullName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => props.setData({
                ...props.data,
                fullName: e.target.value
            })}
            inputMode="text"
            // pattern={"а-яА-Я"}
            className="full-width"
            placeholder="ФИО"/>
        <MainInput
            value={props.data.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => props.setData({
                ...props.data,
                email: e.target.value
            })}
            inputMode="email"
            className="full-width"
            placeholder="Электронная почта"/>

    </>

    const LGLComponent = <></>


    return (
        <>
            <h2 className="subtitle mb-25 center">Зарегистрироваться</h2>
            <div className="flex full-width mb-10">
                <div className={`${styles.btn} ${checkIND ? styles.active : ""} full-width flex-to-center-col`}
                     onClick={() => props.setData({...props.data, type: "IND"})}>Физическое лицо
                </div>
                <div className={`${styles.btn} ${!checkIND ? styles.active : ""} full-width flex-to-center-col`}
                     onClick={() => props.setData({...props.data, type: "LGL"})}>Юридическое лицо
                </div>
            </div>
            {props.data.type}
            <div className="flex-col gap-10">
                {
                    checkIND
                        ? INDComponent
                        : ""

                }
                <MainInput
                    type="password"
                    value={props.data.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => props.setData({
                        ...props.data,
                        password: e.target.value
                    })}
                    className="full-width"
                    placeholder="Пароль"/>
                <MainInput
                    type="password"
                    value={props.data.confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => props.setData({
                        ...props.data,
                        confirmPassword: e.target.value
                    })}
                    className="full-width"
                    placeholder="Подтвердите пароль"/>
            </div>
        </>
    );
};
