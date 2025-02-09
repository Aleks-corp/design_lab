import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import cn from "classnames";
import styles from "./Modal.module.sass";
import Icon from "../Icon";

interface ModalProps {
  outerClassName?: string;
  containerClassName?: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({
  outerClassName,
  containerClassName,
  visible,
  onClose,
  children,
}: ModalProps) => {
  const escFunction = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  useEffect(() => {
    const target = document.querySelector("#modal");
    if (visible && target) {
      disableBodyScroll(target);
    } else {
      clearAllBodyScrollLocks();
    }
  }, [visible]);

  return createPortal(
    visible && (
      <div className={styles.modal} id="modal">
        <div className={cn(styles.outer, outerClassName)}>
          <div
            ref={modalRef}
            className={cn(styles.container, containerClassName)}
          >
            {children}
            <button className={styles.close} onClick={onClose}>
              <Icon title="close" size={14} />
            </button>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default Modal;
