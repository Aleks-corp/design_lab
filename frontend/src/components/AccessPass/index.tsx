import cn from "classnames";
import styles from "./AccessPass.module.sass";
import { UserProfile } from "../../types/auth.types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SetStateAction } from "react";

const AccessPass = ({
  user,
  setDate,
}: {
  user: UserProfile | null;
  setDate: React.Dispatch<SetStateAction<Date>>;
}) => {
  const navigate = useNavigate();
  const SubmitPayment = () => {
    const currentDate = new Date();
    setDate(currentDate);
    navigate("/payment");
  };
  const NavReg = () => {
    toast.error("sign up first, or go to sign in");
    navigate("/register");
  };
  return (
    <div className={styles.info}>
      <p className={styles.text}>
        You can download this product with the All-Access Pass.
      </p>
      <button
        className={cn("button", styles.button)}
        type="button"
        onClick={() => (user ? SubmitPayment() : NavReg())}
      >
        Get All-Access
      </button>
    </div>
  );
};

export default AccessPass;
