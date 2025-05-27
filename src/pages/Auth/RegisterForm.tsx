// // components/RegisterForm.tsx
// import {useState} from 'react';
// import {useForm, SubmitHandler} from 'react-hook-form';
// import {useAppDispatch, useAppSelector} from '../../hooks/state.hook';
// import {registerFunc} from '../../store/actions/user.action.ts';
// import {MainInput} from "../../lib/input/MainInput.tsx";
// import Button from "../../lib/buttons/Button.tsx";
//
// type FormValues = {
//     type: 'IND' | 'LGL';
//     legalType?: 'ИП' | 'ЮЛ';
//     legalId?: string;
//     fullName: string;
//     email: string;
//     password: string;
// };
//
// export default function RegisterForm() {
//     const {isLoading} = useAppSelector((state) => state.user);
//     const [userType, setUserType] = useState<'IND' | 'LGL'>('IND');
//     const {register, handleSubmit, formState} = useForm<FormValues>();
//
//     const onSubmit: SubmitHandler<FormValues> = (data) => {
//         // dispatch(clearError());
//         // dispatch(register({ ...data, type: userType }));
//     };
//
//     return (
//         <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="flex">
//                 <Button
//                     type="button"
//                     className={`type-button ${userType === 'IND' ? 'active' : ''}`}
//                     onClick={() => setUserType('IND')}
//                 >
//                     Физическое лицо
//                 </Button>
//                 <Button
//                     type="button"
//                     className={`type-button ${userType === 'LGL' ? 'active' : ''}`}
//                     onClick={() => setUserType('LGL')}
//                 >
//                     Юридическое лицо
//                 </Button>
//             </div>
//
//             {userType === 'LGL' && (
//                 <>
//                     <select
//                         {...register('legalType', {required: 'Выберите тип организации'})}
//                     >
//                         <option value="">Тип организации</option>
//                         <option value="ИП">ИП</option>
//                         <option value="ЮЛ">Юридическое лицо</option>
//                     </select>
//                     <MainInput
//                         {...register('legalId', {
//                             required: 'Введите ИНН/ОГРН',
//                             pattern: {
//                                 value: /^\d{10,15}$/,
//                                 message: 'Некорректный формат'
//                             }
//                         })}
//                         placeholder="ИНН/ОГРН"
//                     />
//                 </>
//             )}
//
//             <MainInput
//                 {...register('fullName', {required: 'Введите ФИО'})}
//                 placeholder="ФИО"
//             />
//             <MainInput
//                 {...register('email', {
//                     required: 'Введите email',
//                     pattern: {
//                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                         message: 'Некорректный email'
//                     }
//                 })}
//                 placeholder="Email"
//             />
//             <MainInput
//                 type="password"
//                 {...register('password', {
//                     required: 'Введите пароль',
//                     minLength: {
//                         value: 6,
//                         message: 'Минимум 6 символов'
//                     }
//                 })}
//                 placeholder="Пароль"
//             />
//
//             <button type="submit" disabled={isLoading}>
//                 {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
//             </button>
//         </form>
//     );
// };