import { FormEvent, useEffect, useRef, useState } from "react";
import cn from "classnames";
import toast from "react-hot-toast";
import styles from "./UploadPost.module.sass";

import { addPost } from "../../redux/posts/post.thunk";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectIsLogining, selectUserError } from "../../redux/selectors";
import { kitsConstant } from "../../constants/kits.constant";
import { filterConstant } from "../../constants/filter.constant";

import {
  handleFileChange,
  handleImageFileChange,
} from "../../helpers/handleFileChange";
import { setArrayString } from "../../helpers/categoryKitSetArray";
import { imageIndexChanger } from "../../helpers/imageIndexChanger";
import { useUploadFiles } from "../../hooks/useUploadFiles";

import Preview from "./Preview";
import Icon from "../../components/Icon";
import Loader from "../../components/Loader";
import UploadImageInput from "../../components/UploadForm/UploadImageInput";
import UploadFileInput from "../../components/UploadForm/UploadFileInput";
import PostFormFields from "../../components/UploadForm/PostFormFields";
import SwitchSelector from "../../components/UploadForm/SwitchSelector";
import UploadProgressList from "../../components/UploadForm/UploadProgressList";
import { useTheme } from "../../helpers/darkModeContext";
import { useTranslation } from "react-i18next";

const Upload = () => {
  const dispatch = useAppDispatch();
  const { locale } = useTheme();
  const { t } = useTranslation();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const error = useAppSelector(selectUserError);
  const isLoading = useAppSelector(selectIsLogining);

  const [visiblePreview, setVisiblePreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[] | null>(null);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [titleValue, setTitleValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [descriptionUAValue, setDescriptionUAValue] = useState<string>("");
  const [uploadAt, setUploadAt] = useState<string>("");
  const [kitState, setKitState] = useState(
    kitsConstant.map((key) => ({ [key]: false }))
  );
  const [categoryState, setCategoryState] = useState(
    filterConstant.map((key) => ({ [key]: false }))
  );

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

  const {
    uploadFiles,
    imgUploadProgress,
    fileUploadProgress,
    uploadError,
    clearUploadError,
    resetProgress,
  } = useUploadFiles();

  const reset = () => {
    setImageFiles([]);
    setPreviews(null);
    setDownloadFile(null);
    setTitleValue("");
    setDescriptionValue("");
    setDescriptionUAValue("");
    setKitState(kitsConstant.map((key) => ({ [key]: false })));
    setCategoryState(filterConstant.map((key) => ({ [key]: false })));
    setUploadAt("");
    setIsUploading(false);
    resetProgress();
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    clearUploadError();

    const category = setArrayString(categoryState);
    const kits = setArrayString(kitState);

    try {
      switch (true) {
        case !titleValue:
          toast.error("Title is required");
          return;
        case !descriptionValue:
          toast.error("Description is required");
          return;
        case imageFiles.length === 0:
          toast.error("Images are required");
          return;
        case !downloadFile:
          toast.error("Download File is required");
          return;
        case !uploadAt:
          toast.error("Upload set date is required");
          return;
        case kits.length === 0:
          toast.error("Kit is required");
          return;
        case category.length === 0:
          toast.error("Filter category is required");
          return;
        default:
      }
    } finally {
      if (
        !titleValue ||
        !descriptionValue ||
        imageFiles.length === 0 ||
        !downloadFile ||
        !uploadAt ||
        kits.length === 0 ||
        category.length === 0
      ) {
        setIsUploading(false);
      }
    }

    const result = await uploadFiles(imageFiles, downloadFile);

    if (!result) {
      setIsUploading(false);
      return;
    }

    const { uploadedImageUrls, uploadedFileUrl } = result;

    if (!uploadedFileUrl || uploadedImageUrls.length === 0) {
      toast.error("Upload failed. Try again.");
      setIsUploading(false);
      return;
    }

    const data = {
      title: titleValue,
      description: descriptionUAValue
        ? { ua: descriptionUAValue, en: descriptionValue }
        : descriptionValue,
      category: setArrayString(categoryState),
      kits: setArrayString(kitState),
      upload_at: uploadAt,
      filesize: downloadFile ? downloadFile.size.toString() : "0",
      images: uploadedImageUrls,
      downloadlink: uploadedFileUrl,
    };

    const resultAction = await dispatch(addPost(data));

    if (addPost.fulfilled.match(resultAction)) {
      toast.success("Post created!");
      reset();
    } else if (addPost.rejected.match(resultAction)) {
      toast.error("Create post failed");
      setIsUploading(false);
    }

    if (error) {
      toast.error(error);
      console.error(error);
    }

    setIsUploading(false);
  };

  const moveImagePreview = (indexStart: number, indexEnd: number) => {
    if (previews) {
      imageIndexChanger(indexStart, indexEnd, setImageFiles, setPreviews);
    }
  };

  return (
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.wrapper}>
            <div className={styles.head}>
              <h1 className={cn("h2", styles.title)}>
                {t("upload.create-post-title")}
              </h1>
            </div>
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.list}>
                <UploadImageInput
                  imageInputRef={imageInputRef}
                  onImageChange={(e) => handleImageFileChange(e, setImageFiles)}
                />
                <PostFormFields
                  titleValue={titleValue}
                  onTitleChange={(e) => setTitleValue(e.target.value)}
                  descriptionValue={descriptionValue}
                  onDescriptionChange={(e) =>
                    setDescriptionValue(e.target.value)
                  }
                  descriptionUAValue={descriptionUAValue}
                  onDescriptionUAChange={(e) =>
                    setDescriptionUAValue(e.target.value)
                  }
                  uploadAt={uploadAt}
                  onUploadAtChange={(value) => setUploadAt(value)}
                />
                <UploadFileInput
                  fileInputRef={fileInputRef}
                  onFileChange={(e) => handleFileChange(e, setDownloadFile)}
                  fileName={downloadFile?.name}
                />
                <SwitchSelector
                  title="Kits"
                  items={kitState}
                  setItems={setKitState}
                  constants={kitsConstant}
                  containerClass={styles.options}
                  optionClass={styles.option}
                />
                <SwitchSelector
                  title="Filter"
                  items={categoryState}
                  setItems={setCategoryState}
                  constants={filterConstant}
                  containerClass={styles.filteroptions}
                  optionClass={styles.filteroption}
                  showBox={true}
                />
                <UploadProgressList
                  imgUploadProgress={imgUploadProgress}
                  fileUploadProgress={fileUploadProgress}
                />
              </div>

              <div className={styles.foot}>
                <button
                  className={cn("button-stroke tablet-show", styles.button)}
                  onClick={() => setVisiblePreview(true)}
                  type="button"
                >
                  {t("upload.preview-btn")}
                </button>
                <button
                  className={cn("button", styles.button)}
                  type="submit"
                  disabled={isLoading || isUploading}
                >
                  {isLoading || isUploading ? (
                    <Loader className="" />
                  ) : (
                    <>
                      <span>{t("upload.create-post-btn")}</span>
                      <Icon title="arrow-next" size={10} />
                    </>
                  )}
                </button>
                {uploadError && (
                  <div className={cn("status-red", styles.note)}>
                    {uploadError}
                  </div>
                )}
              </div>
            </form>
          </div>
          <Preview
            className={cn(styles.preview, { [styles.active]: visiblePreview })}
            onClose={() => setVisiblePreview(false)}
            moveImagePreview={moveImagePreview}
            previews={previews}
            reset={reset}
            title={titleValue}
            desc={locale === "UA" ? descriptionUAValue : descriptionValue}
            kits={kitState}
            category={categoryState}
            fileSize={downloadFile?.size}
            uploadAt={uploadAt}
          />
        </div>
      </div>
    </>
  );
};

export default Upload;
