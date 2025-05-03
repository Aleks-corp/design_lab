import styles from "./UploadForm.module.sass";

interface UploadProgressListProps {
  imgUploadProgress: { fileName: string; progress: number }[];
  fileUploadProgress: { fileName: string; progress: number };
}

const UploadProgressList: React.FC<UploadProgressListProps> = ({
  imgUploadProgress,
  fileUploadProgress,
}) => (
  <div className={styles.progressList}>
    {imgUploadProgress.map((fileProgress, index) => (
      <div key={index} className={styles.progressItem}>
        <p>{fileProgress.fileName}</p>
        <progress value={fileProgress.progress} max={100}></progress>
        <p>{fileProgress.progress}%</p>
      </div>
    ))}
    {fileUploadProgress.fileName !== "" && (
      <div className={styles.progressItem}>
        <p>{fileUploadProgress.fileName}</p>
        <progress value={fileUploadProgress.progress} max={100}></progress>
        <p>{fileUploadProgress.progress}%</p>
      </div>
    )}
  </div>
);

export default UploadProgressList;
