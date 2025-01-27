import cn from "classnames";
import styles from "./Preview.module.sass";
import Icon from "../../../components/Icon";
import moment from "moment";

interface PreviewProp {
  className?: string;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  previews?: string[] | null;
  reset?: () => void;
  title?: string;
  desc?: string;
  kits?: { [x: string]: boolean }[];
  fileSize?: number;
  uploadAt?: string;
}

const Preview = ({
  className,
  onClose,
  previews,
  reset,
  title,
  desc,
  kits,
  fileSize,
  uploadAt,
}: PreviewProp) => {
  return (
    <div className={cn(className, styles.wrap)}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={onClose}>
          <Icon title="close" size={14} />
        </button>
        <div className={styles.info}>Preview</div>
        <div className={styles.card}>
          {previews && previews.length >= 4 && (
            <div className={styles.preview4x}>
              {previews.map((i, index) => {
                if (index >= 4) {
                  return;
                }
                return index === 0 ? (
                  <div key={index} className={styles.firstRows}>
                    <img src={i} srcSet={i} alt="Post Image" />
                  </div>
                ) : (
                  <div key={index} className={styles.imgwrapper}>
                    <img src={i} srcSet={i} alt="Post Image" />
                  </div>
                );
              })}
            </div>
          )}
          {previews && previews.length < 4 && (
            <div className={styles.preview}>
              <img
                src={previews[0]}
                srcSet={previews[0]}
                alt="Post Template Image"
              />
            </div>
          )}
          {(!previews || previews.length < 0) && (
            <div className={styles.preview}>
              <img
                src={"/images/content/postsimg/post-template.jpg"}
                alt="Post Template Image"
              />
            </div>
          )}
          <div className={styles.link}>
            <div className={styles.body}>
              <div className={styles.line}>
                <div className={styles.title}>
                  {title ? title : "Post Title"}
                </div>
              </div>
              <div className={styles.line}>
                <div className={styles.counter}>
                  {desc ? desc : "Post description"}
                </div>
                <div className={styles.status}>Highest bid</div>
              </div>
            </div>
            <div className={styles.foot}>
              <div className={styles.users}>
                {kits?.map((i, index) => {
                  const [key, value] = Object.entries(i)[0];
                  return (
                    value && (
                      <div key={index} className={styles.avatar}>
                        <img
                          src={`/images/kit-logo/${key}-prog.svg`}
                          alt="Logo"
                        />
                      </div>
                    )
                  );
                })}
              </div>
              <div className={styles.price}>
                {fileSize
                  ? `${(fileSize / 1024 / 1024).toFixed(2)} Mb`
                  : "File Size Mb"}
              </div>
            </div>
            {uploadAt && (
              <p>
                Upload date:{" "}
                {moment(new Date(uploadAt)).format("DD-MM-YYYY_HH:mm")}
              </p>
            )}
          </div>
        </div>
        <button className={styles.clear} onClick={reset}>
          <Icon title="circle-close" size={24} />
          Clear all
        </button>
      </div>
    </div>
  );
};

export default Preview;
