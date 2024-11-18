import cn from "classnames";
import styles from "./LoaderCircle.module.sass";
import { ClassNameProps } from "../../types/className.types";

const Loader = ({ className }: ClassNameProps) => {
  return <div className={cn(styles.loader, className)}></div>;
};

export default Loader;
