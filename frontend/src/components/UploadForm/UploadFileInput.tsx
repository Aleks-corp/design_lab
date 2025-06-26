import styles from "./UploadForm.module.sass";
import Icon from "../Icon";
import { useTranslation } from "react-i18next";

interface UploadFileInputProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string | undefined;
}

const UploadFileInput: React.FC<UploadFileInputProps> = ({
  fileInputRef,
  onFileChange,
  fileName,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.item}>
      <p className={styles.label}>{t("upload.file-label")}</p>
      <p className={styles.note}>{t("upload.file-note")}</p>
      <div className={styles.filedw}>
        <input
          ref={fileInputRef}
          className={styles.load}
          name="downloadfile"
          type="file"
          accept=".zip"
          onChange={onFileChange}
        />
        <div className={styles.icon}>
          <Icon title="upload-file" size={24} />
        </div>
        <p className={styles.format}>{t("upload.file-format")}</p>
      </div>
      <p className={styles.note}>{fileName || t("upload.upload-no-file")}</p>
    </div>
  );
};

export default UploadFileInput;
