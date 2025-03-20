import cn from "classnames";
import styles from "./Preview.module.sass";
import Icon from "../../../components/Icon";
import moment from "moment";
import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import ImagePreview from "./Card";

interface PreviewProp {
  className?: string;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  previews?: string[] | null;
  reset?: () => void;
  title?: string;
  desc?: string;
  kits?: { [x: string]: boolean }[];
  category?: { [x: string]: boolean }[];
  fileSize?: number;
  uploadAt?: string;
  moveImagePreview: (indexStart: number, indexEnd: number) => void;
}

const Preview = ({
  className,
  onClose,
  previews,
  reset,
  title,
  desc,
  kits,
  category,
  fileSize,
  uploadAt,
  moveImagePreview,
}: PreviewProp) => {
  const categoryString = category?.reduce((acc, i) => {
    const [key, value] = Object.entries(i)[0];
    return value ? (acc ? acc + ", " + key : key) : acc;
  }, "");

  const [instanceId] = useState(Symbol("instance-id"));

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        console.log(" source:", source);
        return source.data.instanceId === instanceId;
      },
      onDrop({ source, location }) {
        console.log(" location:", location);
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const destinationSrc = destination.data.src;
        const startSrc = source.data.src;

        if (
          previews &&
          destinationSrc &&
          typeof startSrc === "string" &&
          typeof destinationSrc === "string" &&
          destinationSrc !== startSrc
        ) {
          const startIdx = previews.indexOf(startSrc);
          const endIdx = previews.indexOf(destinationSrc);
          moveImagePreview(startIdx, endIdx);
        }
      },
    });
  }, [instanceId, moveImagePreview, previews]);

  return (
    <div className={cn(className, styles.wrap)}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={onClose}>
          <Icon title="close" size={14} />
        </button>
        <div className={styles.info}>Preview</div>
        <div className={styles.card}>
          {previews && previews.length > 0 && (
            <div className={styles.preview4x}>
              {previews.map((i, index) => {
                return (
                  <ImagePreview src={i} key={index} instanceId={instanceId} />
                );
              })}
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
            {categoryString && (
              <>
                <p>Category:</p>
                <p className={styles.category}>{categoryString}</p>
              </>
            )}
            {uploadAt && (
              <p className={styles.upload}>
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
