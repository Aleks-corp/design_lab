import { FormEvent, useEffect, useState } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import cn from "classnames";
import styles from "./UploadPost.module.sass";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import Switch from "../../components/Switch";
import Loader from "../../components/Loader";
import Preview from "./Preview";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { selectIsLogining, selectUserError } from "../../redux/selectors";
import { kitsConstant } from "../../constants/kits.constant";
import TextArea from "../../components/TextArea";
import { filterConstant } from "../../constants/filter.constant";
import {
  handleFileChange,
  handleImageFileChange,
} from "../../helpers/handleFileChange";
import { addPost } from "../../redux/posts/post.thunk";
import toast from "react-hot-toast";
import { FileUploadProgress } from "../../types/upload.types";
import { uploadDownLoadFile, uploadImgFiles } from "../../helpers/uploadFile";
import { generatePresignedUrl } from "../../helpers/genSignedUrl";
import { setArrayString } from "../../helpers/categoryKitSetArray";
import { imageIndexChanger } from "../../helpers/imageIndexChanger";

const Upload = () => {
  const dispatch = useAppDispatch();

  const [kitState, setKitState] = useState(
    kitsConstant.map((key) => ({ [key]: false }))
  );
  const [categoryState, setCategoryState] = useState(
    filterConstant.map((key) => ({ [key]: false }))
  );

  const [visiblePreview, setVisiblePreview] = useState(false);
  const error = useAppSelector(selectUserError);
  const isLoading = useAppSelector(selectIsLogining);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[] | null>(null);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [titleValue, setTitleValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [fileUploadProgress, setFileUploadProgress] =
    useState<FileUploadProgress>({ fileName: "", progress: 0 });
  const [imgUploadProgress, setImgUploadProgress] = useState<
    FileUploadProgress[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadAt, setUploadAt] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const moveImagePreview = (indexStart: number, indexEnd: number) => {
    if (previews) {
      imageIndexChanger(indexStart, indexEnd, setImageFiles, setPreviews);
    }
  };

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

  const reset = () => {
    setImageFiles([]);
    setPreviews(null);
    setDownloadFile(null);
    setTitleValue("");
    setDescriptionValue("");
    setKitState(kitsConstant.map((key) => ({ [key]: false })));
    setCategoryState(filterConstant.map((key) => ({ [key]: false })));
    setUploadAt("");
    setIsUploading(false);
    setFileUploadProgress({ fileName: "", progress: 0 });
    setImgUploadProgress([]);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError("");

    const category = setArrayString(categoryState);
    const kits = setArrayString(kitState);

    try {
      switch (true) {
        case !titleValue:
          toast.error("Title is required");
          break;
        case !descriptionValue:
          toast.error("Description is required");
          break;
        case category.length === 0:
          toast.error("Filter category is required");
          break;
        case kits.length === 0:
          toast.error("Kit is required");
          break;
        case !uploadAt:
          toast.error("Upload set date is required");
          break;
        case imageFiles.length === 0:
          toast.error("Images are required");
          break;
        case !downloadLink || !downloadFile:
          toast.error("Download File is required");
          break;
        default:
      }
    } finally {
      setIsUploading(false);
    }

    try {
      let signedUrls: string[];
      try {
        signedUrls = await generatePresignedUrl(imageFiles, downloadFile);
      } catch (err) {
        setUploadError("Failed to generate signed URLs.");
        console.error("Error generating signed URLs:", err);
        toast.error("Failed to generate signed URLs.");
        toast.error("Please try signout and singin again.");
        setIsUploading(false);
        return;
      }

      let uploadedImageUrls: string[] = [];
      let uploadImgPromises: Promise<void>[] = [];
      try {
        ({ uploadedImageUrls, uploadImgPromises } = await uploadImgFiles(
          imageFiles,
          signedUrls,
          setImgUploadProgress
        ));
      } catch (err) {
        setUploadError("Failed to upload images. Try again.");
        console.error("Image upload error:", err);
        toast.error("Failed to upload images. Try again.");
        setIsUploading(false);
        return;
      }

      let uploadedFileUrl = "";
      let uploadFilePromises: Promise<void>[] = [];
      try {
        ({ uploadedFileUrl, uploadFilePromises } = await uploadDownLoadFile(
          downloadFile,
          signedUrls,
          imageFiles,
          setFileUploadProgress
        ));
      } catch (err) {
        setUploadError("Failed to upload file. Try again.");
        console.error("File upload error:", err);
        toast.error("Failed to upload file.");
        setIsUploading(false);
        return;
      }

      try {
        await Promise.all([...uploadImgPromises, ...uploadFilePromises]);
      } catch (err) {
        setUploadError("An error occurred while uploading files.");
        console.error("Error during file uploads:", err);
        toast.error("An error occurred while uploading files.");
        setIsUploading(false);
        return;
      }
      toast.success("Files uploaded successfully!");

      if (!uploadedFileUrl) {
        toast.error("Failed to upload file. Try again.");
        setIsUploading(false);
        return;
      }
      if (uploadedImageUrls.length === 0) {
        toast.error("Failed to upload images. Try again.");
        setIsUploading(false);
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
        downloadlink: uploadedFileUrl ? uploadedFileUrl : downloadLink,
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
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong. Please try again.");
      setIsUploading(false);
    }
  };

  const inputProps = {
    placeholder: "Select upload Date",
    className: styles.inputdate,
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
                      JPG, PNG, WEBP. Max 8 files up to 4Mb.
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
                        onChange={(e) => setTitleValue(e.target.value)}
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
                    Drag or choose your File to upload or insert link below
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
                    <div className={styles.format}>ZIP. Max 2Gb.</div>
                  </div>
                  <div className={styles.field}>
                    <TextInput
                      label="Download link"
                      name="downloadlink"
                      type="text"
                      placeholder="Please insert download link for file"
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
                  type="submit"
                  disabled={isLoading || isUploading}
                >
                  {isLoading || isUploading ? (
                    <Loader className="" />
                  ) : (
                    <>
                      <span>Create post</span>
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
            desc={descriptionValue}
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
