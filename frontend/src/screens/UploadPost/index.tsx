import { FormEvent, useEffect, useState } from "react";
import cn from "classnames";
import styles from "./UploadPost.module.sass";
// import Dropdown from "../../components/Dropdown";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import Switch from "../../components/Switch";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import Preview from "./Preview";
// import Cards from "./Cards";
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
import axios from "axios";
import { instance } from "../../api/axios";

interface FileUploadProgress {
  fileName: string;
  progress: number;
}

const Upload = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [kits, setKits] = useState(
    kitsConstant.map((key) => ({ [key]: false }))
  );
  const [filters, setFilters] = useState(
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
  const [fileUploadProgress, setFileUploadProgress] = useState<
    FileUploadProgress[]
  >([]);

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
    // 1. Отримуємо підписані URL з бекенду
    const response = await instance.post("/generate-signed-urls", {
      files: [
        ...imageFiles.map((file) => file.name),
        downloadFile ? downloadFile.name : "",
      ],
    });

    const { signedUrls } = response.data;

    // 2. Завантажуємо файли на S3 за підписаними URL

    // Масив для URL зображень
    const uploadedImageUrls: string[] = [];

    // Масив для всіх обіцянок завантаження
    const uploadPromises = [];
    // Завантаження зображень
    imageFiles.forEach((file, index) => {
      const url = signedUrls[index];
      const uploadPromise = axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFileUploadProgress((prev) => {
              const newProgress = [...prev];
              newProgress.push({
                fileName: downloadFile?.name || "",
                progress: percent,
              });
              return newProgress;
            });
          }
        },
      });

      // Додаємо URL до списку зображень після завершення
      uploadPromise
        .then(() => {
          uploadedImageUrls.push(url.split("?")[0]); // URL без параметрів
        })
        .catch((error) => {
          console.error(`Failed to upload image ${file.name}:`, error);
        });

      uploadPromises.push(uploadPromise);
    });

    // Завантаження основного файлу (якщо є)

    let uploadedFileUrl = "";
    if (downloadFile) {
      const url = signedUrls[imageFiles.length]; // Позиція для основного файлу
      const uploadPromise = axios.put(url, downloadFile, {
        headers: {
          "Content-Type": downloadFile.type,
        },
      });
      uploadPromise
        .then(() => {
          uploadedFileUrl = url.split("?")[0]; // URL без параметрів
        })
        .catch((error) => {
          console.error(`Failed to upload file ${downloadFile.name}:`, error);
        });
      uploadPromises.push(uploadPromise);
    }

    // Чекаємо завершення завантаження всіх файлів
    await Promise.all(uploadPromises);

    toast.success("Files uploaded successfully!");
    const filter = filters
      .map((i) => {
        if (Object.values(i)[0] === true) {
          return Object.keys(i)[0];
        }
        return null;
      })
      .filter((item) => item !== null);

    const kit = kits
      .map((i) => {
        if (Object.values(i)[0] === true) {
          return Object.keys(i)[0];
        }
        return null;
      })
      .filter((item) => item !== null);

    if (!uploadAt) {
      return;
    }

    // const data = new FormData();
    // data.append("title", titleValue);
    // data.append("description", descriptionValue);
    // data.append("filter", JSON.stringify(filter));
    // data.append("kits", JSON.stringify(kit));
    // data.append("upload_at", uploadAt.toString());
    // data.append("filesize", downloadFile ? downloadFile.size.toString() : "0");
    // if (downloadFile) data.append("downloadfile", downloadFile);
    // if (downloadLink) data.append("downloadLink", downloadLink);
    // imageFiles.forEach((file) => data.append("imagefiles", file));
    // data.forEach((value, key) => {
    //   console.log(`${key}:`, value);
    // });
    const data = {
      title: titleValue,
      description: descriptionValue,
      category: filter,
      kits: kit,
      upload_at: uploadAt,
      filesize: downloadFile ? downloadFile.size.toString() : "0",
      downloadlink: uploadedFileUrl, // URL основного файлу
      image: uploadedImageUrls, // Масив URL зображень
    };

    const resultAction = await dispatch(addPost(data));

    if (addPost.fulfilled.match(resultAction)) {
      toast.success("Post successfully uploaded!");
      reset();
    } else if (addPost.rejected.match(resultAction)) {
      toast.error("Upload failed");
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
    setKits(kitsConstant.map((key) => ({ [key]: false })));
    setFilters(filterConstant.map((key) => ({ [key]: false })));
    setUploadAt("");
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
                          kits.find((i) => Object.keys(i)[0] === kit)?.[kit] ||
                          false
                        }
                        setValue={(newValue) =>
                          setKits((prevKits) =>
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
                          filters.find((i) => Object.keys(i)[0] === filter)?.[
                            filter
                          ] || false
                        }
                        setValue={(newValue) =>
                          setFilters((prevKits) =>
                            prevKits.map((i) =>
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
              </div>

              <div className={styles.foot}>
                {fileUploadProgress.map((fileProgress, index) => (
                  <div key={index}>
                    <div>{fileProgress.fileName}</div>
                    <progress
                      value={fileProgress.progress}
                      max={100}
                    ></progress>
                    <div>{fileProgress.progress}%</div>
                  </div>
                ))}
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
                  {isLoading ? (
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
            kits={kits}
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
