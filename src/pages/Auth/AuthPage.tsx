// import styles from "./auth.module.sass"
// import {useState} from "react";
// import Button from "../../lib/buttons/Button.tsx";
// import AuthForm from "./AuthForm.tsx";
// import RegisterForm from "./RegisterForm.tsx";
//
// export default function Auth() {
//     const [isAuth, setIsAuth] = useState<boolean>(true);
//
//     return (
//         <div className="main__container flex-to-center-col">
//             <div className={`${styles.auth} p-20`}>
//                 <div className={`${styles.authContainer}`}>
//                     <div className={`${styles.authBlock}`}>
//                         {isAuth
//                             ? <AuthForm/> : <RegisterForm/>
//                         }
//                     </div>
//                     <Button onClick={() => setIsAuth(s => !s)}>Изменить</Button>
//                 </div>
//             </div>
//         </div>
//     )
// }
