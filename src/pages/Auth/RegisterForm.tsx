import {MainInput} from "../../lib/input/MainInput.tsx";
import {ChangeEvent} from "react";
import styles from "./auth.module.sass";
import {RegisterData} from "../../store/interfaces/user.interface.ts";

interface Data extends RegisterData {
    confirmPassword: string;
}

type Props = {
    data: Data;
    setData: (authData: Data) => void;
    errors?: Record<string, string[]>;
};

export const RegisterForm = (props: Props) => {
    const checkIND = props.data.type === "IND";

    return (
        <>
            <h2 className="subtitle mb-15 center">Зарегистрироваться</h2>

            {/* Переключатель типа пользователя */}
            <div className="flex full-width mb-10">
                <div
                    className={`${styles.btn} ${checkIND ? styles.active : ""} full-width flex-to-center-col`}
                    onClick={() => props.setData({...props.data, type: "IND"})}
                >
                    Физическое лицо
                </div>
                <div
                    className={`${styles.btn} ${!checkIND ? styles.active : ""} full-width flex-to-center-col`}
                    onClick={() => props.setData({...props.data, type: "LGL", legalType: "ЮЛ"})}
                >
                    Юр. лицо / ИП
                </div>
            </div>

            {checkIND ? (
                <div className="flex-col gap-8">
                    <MainInput
                        label="ФИО"
                        value={props.data.fullName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            props.setData({...props.data, fullName: e.target.value})
                        }
                        inputMode="text"
                        pattern="а-яА-Я"
                        placeholder="Иванов Иван Иванович"
                        error={props.errors?.fullName}
                    />

                    <MainInput
                        label="Почта"
                        value={props.data.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            props.setData({...props.data, email: e.target.value})
                        }
                        inputMode="email"
                        placeholder="Электронная почта"
                        error={props.errors?.email}
                    />
                </div>
            ) : (
                <>
                    {/* Радио для ЮЛ / ИП */}
                    <div className="mb-10">
                        <label className="label">Выберите тип организации:</label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioOption}>
                                <input
                                    type="radio"
                                    name="legalType"
                                    value="ЮЛ"
                                    checked={props.data.legalType === "ЮЛ"}
                                    onChange={() => props.setData({...props.data, legalType: "ЮЛ"})}
                                />
                                <span>Юридическое лицо</span>
                            </label>

                            <label className={styles.radioOption}>
                                <input
                                    type="radio"
                                    name="legalType"
                                    value="ИП"
                                    checked={props.data.legalType === "ИП"}
                                    onChange={() => props.setData({...props.data, legalType: "ИП"})}
                                />
                                <span>Индивидуальный предприниматель</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex-col gap-8">

                        <MainInput
                            label={props.data.legalType === "ЮЛ" ? "ОГРН / ИНН" : "ОГРНИП / ИНН"}
                            value={props.data.legalId}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                props.setData({...props.data, legalId: e.target.value})
                            }
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder={
                                props.data.legalType === "ЮЛ"
                                    ? "Введите ОГРН (13 цифр)"
                                    : "Введите ОГРНИП (15 цифр)"
                            }
                            error={props.errors?.legalId}
                        />

                        <MainInput
                            label="Email"
                            value={props.data.email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                props.setData({...props.data, email: e.target.value})
                            }
                            inputMode="email"
                            placeholder="name@example.com"
                            error={props.errors?.email}
                        />
                    </div>
                </>
            )}

            <div className="flex-col gap-8 mt-8">
                <MainInput
                    type="password"
                    label="Пароль"
                    value={props.data.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        props.setData({...props.data, password: e.target.value})
                    }
                    placeholder="Придумайте надёжный пароль"
                    error={props.errors?.password}
                />

                <MainInput
                    type="password"
                    label="Подтвердите пароль"
                    value={props.data.confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        props.setData({...props.data, confirmPassword: e.target.value})
                    }
                    placeholder="Ещё раз пароль"
                    error={props.errors?.confirmPassword}
                />
            </div>
        </>
    );
};