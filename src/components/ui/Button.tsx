import styles from './Button.module.css';

interface ButtonProps {
  onClick?: () => void;
  text?: string;
}

export default function Button({ onClick, text }: ButtonProps) {
  return (
    <button className={styles.btn} onClick={onClick}>
      {text}
    </button>
  );
}
