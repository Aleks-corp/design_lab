import cn from "classnames";
import styles from "./Loader.module.sass";

interface LoaderProps {
  color?: string;
  className?: string;
}

const Loader = ({ className, color }: LoaderProps) => {
  return (
    <div
      className={cn(styles.loader, className, {
        [styles.loaderWhite]: color === "white",
      })}
    ></div>
  );
};

export default Loader;
