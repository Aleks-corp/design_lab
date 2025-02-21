import cn from "classnames";
import styles from "./Report.module.sass";
import TextArea from "../TextArea";
import { FormEvent, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { sendMessageSpt } from "../../redux/admin/admin.thunk";

interface ReportProps {
  className?: string;
  onClose: () => void;
}

const Report = ({ className, onClose }: ReportProps) => {
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(sendMessageSpt({ message }));
    clear();
  };
  const clear = () => {
    setMessage("");
    onClose();
  };
  return (
    <form onSubmit={sendMessage} className={cn(className, styles.transfer)}>
      <div className={cn("h4", styles.title)}>Report</div>
      <div className={styles.text}>
        Shortly describe your problem and we will help to decide it
      </div>
      <TextArea
        className={styles.field}
        label="message"
        name="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us the details"
        required={true}
      />
      <div className={styles.btns}>
        <button className={cn("button", styles.button)} type="submit">
          Send now
        </button>
        <button
          className={cn("button-stroke", styles.button)}
          type="reset"
          onClick={clear}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Report;
