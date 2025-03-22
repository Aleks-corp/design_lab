import { forwardRef } from "react";
import cn from "classnames";
import styles from "./PhoneInput.module.sass";
import { ChangeEventHandler, InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  hookformprop?: UseFormRegisterReturn;
  maxLength?: number;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    { className, label, value, onChange, hookformprop, maxLength, ...props },
    ref
  ) => {
    return (
      <div className={cn(styles.field, className)}>
        {label && <div className={styles.label}>{label}</div>}
        <div className={styles.wrap}>
          <input
            ref={ref}
            className={styles.input}
            value={value}
            onChange={onChange}
            type="tel"
            autoComplete="tel"
            maxLength={maxLength}
            {...props}
            {...hookformprop}
          />
        </div>
      </div>
    );
  }
);

export default PhoneInput;
