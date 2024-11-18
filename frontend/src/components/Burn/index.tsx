import cn from "classnames";
import styles from "./Burn.module.sass";
import { ClassNameProps } from "../../types/className.types";

const Burn = ({ className }: ClassNameProps) => {
  return (
    <div className={cn(className, styles.transfer)}>
      <div className={cn("h4", styles.title)}>Burn token</div>
      <div className={styles.text}>
        Are you sure to burn this token? This action cannot be undone. Token
        will be transfered to zero address
      </div>
      <div className={styles.btns}>
        <button className={cn("button-pink", styles.button)}>Continue</button>
        <button className={cn("button-stroke", styles.button)}>Cancel</button>
      </div>
    </div>
  );
};

export default Burn;
