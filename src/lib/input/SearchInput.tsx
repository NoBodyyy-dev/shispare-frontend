import { InputHTMLAttributes } from 'react'
import styles from "./input.module.sass"

export default function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} placeholder='Искать по названию, категории, артикулу' className={styles.inputHeader}/>;
}
