import styles from "./Button.module.css";

/**
 * Reusable button with CSS Module variant support.
 * Pass type="primary", "back", or "position" to apply the corrosponding style.
 *
 * @param {React.ReactNode} children - Button label/content
 * @param {string} type - Style variant: "primary" | "back" | "position"
 * @param {Function} onClick - Click handler
 * @returns
 */
function Button({ children, type, onClick }) {
  return (
    <button
      className={`${styles.btn} ${styles[type]}`}
      // styles[type] uses bracket notation - equivalent to styles.primary when
      // type="primary"
      // allows dynamic class selection based on a variable
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
