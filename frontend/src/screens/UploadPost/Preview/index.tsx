import cn from "classnames";
import styles from "./Preview.module.sass";
import Icon from "../../../components/Icon";

interface PreviewProp {
  className?: string;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  previews?: string[] | null;
  reset?: () => void;
  title?: string;
  desc?: string;
  fileSize?: number;
}

const Preview = ({
  className,
  onClose,
  previews,
  reset,
  title,
  desc,
  fileSize,
}: PreviewProp) => {
  return (
    <div className={cn(className, styles.wrap)}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={onClose}>
          <Icon title="close" size={14} />
        </button>
        <div className={styles.info}>Preview</div>
        <div className={styles.card}>
          {previews && previews.length > 0 ? (
            <div className={styles.preview4x}>
              {previews?.map((i, index) => {
                return index === 0 ? (
                  <div className={styles.firstRows}>
                    <img
                      key={index}
                      src={i}
                      srcSet={i}
                      alt="Uploaded Thumbnail"
                    />
                  </div>
                ) : (
                  <div className={styles.imgwrapper}>
                    <img
                      key={index}
                      src={i}
                      srcSet={i}
                      alt="Uploaded Thumbnail"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.preview}>
              <img
                src={"/images/content/card-pic-6.jpg"}
                srcSet={"/images/content/card-pic-6@2x.jpg"}
                alt="Uploaded Thumbnail"
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
                <div className={styles.avatar}>
                  <img src="/images/kit-logo/html-prog.svg" alt="Avatar" />
                </div>
                <div className={styles.avatar}>
                  <img src="/images/kit-logo/react-prog.svg" alt="Avatar" />
                </div>
                <div className={styles.avatar}>
                  <img src="/images/kit-logo/figma-prog.svg" alt="Avatar" />
                </div>
              </div>
              <div className={styles.price}>
                {fileSize
                  ? `${(fileSize / 1024 / 1024).toFixed(2)} Mb`
                  : "File Size Mb"}
              </div>
            </div>
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
