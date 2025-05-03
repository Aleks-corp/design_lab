import styles from "./UploadForm.module.sass";
import Icon from "../Icon";

interface UploadFileInputProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string | undefined;
}

const UploadFileInput: React.FC<UploadFileInputProps> = ({
  fileInputRef,
  onFileChange,
  fileName,
}) => (
  <div className={styles.item}>
    <p className={styles.label}>Upload File</p>
    <p className={styles.note}>
      Drag or choose your File to upload or insert link below
    </p>
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
      <p className={styles.format}>ZIP. Max 2Gb.</p>
    </div>
    <p className={styles.note}>{fileName || "No file selected"}</p>
  </div>
);

export default UploadFileInput;
