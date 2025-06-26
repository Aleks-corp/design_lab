import styles from "./UploadForm.module.sass";
import Icon from "../Icon";
import { useTranslation } from "react-i18next";

interface UploadImageInputProps {
  imageInputRef: React.RefObject<HTMLInputElement>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadImageInput: React.FC<UploadImageInputProps> = ({
  imageInputRef,
  onImageChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.item}>
      <h2 className={styles.category}>{t("upload.image-label")}</h2>
      <p className={styles.note}>{t("upload.image-note")}</p>
      <div className={styles.file}>
        <input
          ref={imageInputRef}
          className={styles.load}
          name="imagefiles"
          type="file"
          accept=".jpg, .jpeg, .png, .webp"
          onChange={onImageChange}
          multiple
        />
        <div className={styles.icon}>
          <Icon title="upload-file" size={24} />
        </div>
        <p className={styles.format}>{t("upload.image-format")}</p>
      </div>
    </div>
  );
};

export default UploadImageInput;
