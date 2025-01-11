import { FormEvent, useEffect, useState } from "react";
import cn from "classnames";
import styles from "./UploadPost.module.sass";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import Switch from "../../components/Switch";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import Preview from "./Preview";
import FolowSteps from "./FolowSteps";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";

import {
  selectIsAdmin,
  selectIsLogining,
  selectUserError,
} from "../../redux/selectors";
import { kitsConstant } from "../../constants/kits.constant";
import TextArea from "../../components/TextArea";
import { filterConstant } from "../../constants/filter.constant";
import {
  handleFileChange,
  handleImageFileChange,
} from "../../helpers/handleFileChange";
import { addPost } from "../../redux/posts/post.thunk";
import toast from "react-hot-toast";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { FileUploadProgress } from "../../types/upload.types";
import { uploadDownLoadFile, uploadImgFiles } from "../../helpers/uploadFile";
import { generatePresignedUrl } from "../../helpers/genSignedUrl";
import { setArrayString } from "../../helpers/categoryKitSetArray";

const Upload = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [kitState, setKitState] = useState(
    kitsConstant.map((key) => ({ [key]: false }))
  );
  const [categoryState, setCategoryState] = useState(
    filterConstant.map((key) => ({ [key]: false }))
  );

  const [visibleModal, setVisibleModal] = useState(false);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const error = useAppSelector(selectUserError);
  const isLoading = useAppSelector(selectIsLogining);
  const isAdmin = useAppSelector(selectIsAdmin);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[] | null>(null);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [titleValue, seTitleValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [fileUploadProgress, setFileUploadProgress] =
    useState<FileUploadProgress>({ fileName: "", progress: 0 });
  const [imgUploadProgress, setImgUploadProgress] = useState<
    FileUploadProgress[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadAt, setUploadAt] = useState<string>("");

  useEffect(() => {
    if (imageFiles.length > 0) {
      const urls = imageFiles.map((i) => URL.createObjectURL(i));
      setPreviews(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setPreviews(null);
    }
  }, [imageFiles]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const signedUrls = await generatePresignedUrl(imageFiles, downloadFile);

    const { uploadedImageUrls, uploadImgPromises } = await uploadImgFiles(
      imageFiles,
      signedUrls,
      setImgUploadProgress
    );

    const { uploadedFileUrl, uploadFilePromises } = await uploadDownLoadFile(
      downloadFile,
      signedUrls,
      imageFiles,
      setFileUploadProgress
    );
    const uploadPromises: Promise<void>[] = [
      ...uploadImgPromises,
      ...uploadFilePromises,
    ];

    await Promise.all(uploadPromises);

    toast.success("Files uploaded successfully!");
    const category = setArrayString(categoryState);

    const kits = setArrayString(kitState);

    if (!uploadAt) {
      toast.error("Upload set date is fail");
      return;
    }

    const data = {
      title: titleValue,
      description: descriptionValue,
      category,
      kits,
      upload_at: uploadAt,
      filesize: downloadFile ? downloadFile.size.toString() : "0",
      images: uploadedImageUrls,
      downloadlink: downloadLink ? downloadLink : uploadedFileUrl,
    };

    const resultAction = await dispatch(addPost(data));

    if (addPost.fulfilled.match(resultAction)) {
      toast.success("Post successfully uploaded!");
      reset();
    } else if (addPost.rejected.match(resultAction)) {
      toast.error("Upload failed");
      setIsUploading(false);
    }

    if (error) {
      toast.error(error);
      console.error(error);
    }
  };
  const reset = () => {
    setImageFiles([]);
    setPreviews(null);
    setDownloadFile(null);
    seTitleValue("");
    setDescriptionValue("");
    setKitState(kitsConstant.map((key) => ({ [key]: false })));
    setCategoryState(filterConstant.map((key) => ({ [key]: false })));
    setUploadAt("");
    setIsUploading(false);
    setFileUploadProgress({ fileName: "", progress: 0 });
    setImgUploadProgress([]);
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const inputProps = {
    placeholder: "Select upload Date",
    className: styles.input,
    required: true,
    value: uploadAt ? uploadAt : "",
  };

  return (
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.wrapper}>
            <div className={styles.head}>
              <div className={cn("h2", styles.title)}>Create new post</div>
            </div>
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Upload Image</div>
                  <div className={styles.note}>
                    Drag or choose your Image to upload
                  </div>
                  <div className={styles.file}>
                    <input
                      className={styles.load}
                      name="imagefiles"
                      type="file"
                      accept=".jpg, .jpeg, .png, .webp"
                      onChange={(e) => handleImageFileChange(e, setImageFiles)}
                      multiple
                    />
                    <div className={styles.icon}>
                      <Icon title="upload-file" size={24} />
                    </div>
                    <div className={styles.format}>
                      JPG, PNG, WEBP. Max 4 files up to 4Mb.
                    </div>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.fieldset}>
                    <div className={styles.field}>
                      <TextInput
                        label="Post title"
                        name="title"
                        type="text"
                        placeholder="Please enter Post title"
                        value={titleValue}
                        onChange={(e) => seTitleValue(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <TextArea
                        label="Description"
                        name="description"
                        placeholder="Please enter short description"
                        value={descriptionValue}
                        onChange={(e) => setDescriptionValue(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <div className={styles.label}>Datetime to upload</div>
                      <div className={styles.wrap}>
                        <Datetime
                          inputProps={inputProps}
                          onChange={(e) => setUploadAt(e.toString())}
                          value={uploadAt !== "" ? new Date(uploadAt) : ""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>
                    Upload File (or insert download link)
                  </div>
                  <div className={styles.note}>
                    Drag or choose your File to upload or incert link below
                  </div>
                  <div className={styles.filedw}>
                    <input
                      className={styles.load}
                      name="downloadfile"
                      type="file"
                      accept=".zip"
                      onChange={(e) => handleFileChange(e, setDownloadFile)}
                    />
                    <div className={styles.icon}>
                      <Icon title="upload-file" size={24} />
                    </div>
                    <div className={styles.format}>ZIP. Max 100Mb.</div>
                  </div>
                  <div className={styles.field}>
                    <TextInput
                      label="Download link"
                      name="downloadlink"
                      type="text"
                      placeholder="Please incert download link for file"
                      value={downloadLink}
                      onChange={(e) => setDownloadLink(e.target.value)}
                    />
                  </div>
                </div>
                <p className={styles.text}>Kits</p>
                <div className={styles.options}>
                  {kitsConstant.map((kit, index) => (
                    <div key={index} className={styles.option}>
                      <Switch
                        value={
                          kitState.find((i) => Object.keys(i)[0] === kit)?.[
                            kit
                          ] || false
                        }
                        setValue={(newValue) =>
                          setKitState((prevKits) =>
                            prevKits.map((i) =>
                              Object.keys(i)[0] === kit
                                ? { [kit]: newValue }
                                : i
                            )
                          )
                        }
                        name={kit}
                      />
                    </div>
                  ))}
                </div>
                <p className={styles.text}>Filter</p>
                <div className={styles.filteroptions}>
                  {filterConstant.map((filter, index) => (
                    <div key={index} className={styles.filteroption}>
                      <Switch
                        value={
                          categoryState.find(
                            (i) => Object.keys(i)[0] === filter
                          )?.[filter] || false
                        }
                        setValue={(newValue) =>
                          setCategoryState((prevCats) =>
                            prevCats.map((i) =>
                              Object.keys(i)[0] === filter
                                ? { [filter]: newValue }
                                : i
                            )
                          )
                        }
                      />
                      <div className={styles.box}>
                        <p className={styles.category}>{filter}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  {imgUploadProgress.map((fileProgress, index) => (
                    <div key={index}>
                      <div>{fileProgress.fileName}</div>
                      <progress
                        value={fileProgress.progress}
                        max={100}
                      ></progress>
                      <div>{fileProgress.progress}%</div>
                    </div>
                  ))}
                  {fileUploadProgress.fileName !== "" && (
                    <div>
                      <div>{fileUploadProgress.fileName}</div>
                      <progress
                        value={fileUploadProgress.progress}
                        max={100}
                      ></progress>
                      <div>{fileUploadProgress.progress}%</div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.foot}>
                <button
                  className={cn("button-stroke tablet-show", styles.button)}
                  onClick={() => setVisiblePreview(true)}
                  type="button"
                >
                  Preview
                </button>
                <button
                  className={cn("button", styles.button)}
                  // onClick={() => setVisibleModal(true)}
                  type="submit"
                >
                  {isLoading || isUploading ? (
                    <Loader className="" />
                  ) : (
                    <span>Create POST</span>
                  )}

                  <Icon title="arrow-next" size={10} />
                </button>
              </div>
            </form>
          </div>
          <Preview
            className={cn(styles.preview, { [styles.active]: visiblePreview })}
            onClose={() => setVisiblePreview(false)}
            previews={previews}
            reset={reset}
            title={titleValue}
            desc={descriptionValue}
            kits={kitState}
            fileSize={downloadFile?.size}
            uploadAt={uploadAt}
          />
        </div>
      </div>
      <Modal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <FolowSteps className={styles.steps} />
      </Modal>
    </>
  );
};

export default Upload;
