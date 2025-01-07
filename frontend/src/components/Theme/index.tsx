import cn from "classnames";
import styles from "./Theme.module.sass";
import { ClassNameProps } from "../../types/className.types";
import { useTheme } from "../../helpers/darkModeContext";

const Theme = ({ className }: ClassNameProps) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <label
      className={cn(
        styles.theme,
        { [styles.theme]: className === "theme" },
        { [styles.themeBig]: className === "theme-big" }
      )}
    >
      <input
        className={styles.input}
        checked={darkMode}
        onChange={toggleDarkMode}
        type="checkbox"
      />
      <span className={styles.inner}>
        <span className={styles.box}></span>
      </span>
    </label>
  );
};

export default Theme;
