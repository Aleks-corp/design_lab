import styles from "./UploadForm.module.sass";
import Icon from "../Icon";

interface UploadImageInputProps {
  imageInputRef: React.RefObject<HTMLInputElement>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadImageInput: React.FC<UploadImageInputProps> = ({
  imageInputRef,
  onImageChange,
}) => (
  <div className={styles.item}>
    <h2 className={styles.category}>Upload Image</h2>
    <p className={styles.note}>Drag or choose your Image to upload</p>
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
      <p className={styles.format}>JPG, PNG, WEBP. Max 8 files up to 4Mb.</p>
    </div>
  </div>
);

export default UploadImageInput;
