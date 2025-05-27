import { motion, AnimatePresence } from 'framer-motion';
import styles from "./message.module.sass"
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {removeMessage} from "../../store/slices/push.slice.ts";

export default function PushMessageList() {
    const dispatch = useAppDispatch();
    const {messages} = useAppSelector((state) => state.push);

    return (
        <div className={styles.pushContainer}>
            <AnimatePresence>
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{opacity: 0, x: 100}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: 100}}
                        transition={{duration: 0.3}}
                        className={`${styles.pushMessage} mb-5`}
                    >
                        {msg.text}
                        <div className={`${styles.pushX} fz-18`} onClick={() => dispatch(removeMessage(msg.id))}>x</div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};