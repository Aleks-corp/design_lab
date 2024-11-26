import { FormEvent, useEffect, useState } from "react";
import cn from "classnames";
import styles from "./UploadPost.module.sass";
// import Dropdown from "../../components/Dropdown";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
// import Switch from "../../components/Switch";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import Preview from "./Preview";
// import Cards from "./Cards";
import FolowSteps from "./FolowSteps";

import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";

import {
  selectIsAdmin,
  selectIsLogining,
  selectUserError,
} from "../../redux/selectors";
// import { addPost } from "../../redux/posts/post.thunk";

// const royaltiesOptions = ["10%", "20%", "30%"];

// const items = [
//   {
//     title: "Create collection",
//     color: "#4BC9F0",
//   },
//   {
//     title: "Crypto Legend - Professor",
//     color: "#45B26B",
//   },
//   {
//     title: "Crypto Legend - Professor",
//     color: "#EF466F",
//   },
//   {
//     title: "Legend Photography",
//     color: "#9757D7",
//   },
// ];

const Upload = () => {
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // const [royalties, setRoyalties] = useState(royaltiesOptions[0]);
  // const [sale, setSale] = useState(true);
  // const [price, setPrice] = useState(false);
  // const [locking, setLocking] = useState(false);

  const [visibleModal, setVisibleModal] = useState(false);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const error = useAppSelector(selectUserError);
  const isLoading = useAppSelector(selectIsLogining);
  const isAdmin = useAppSelector(selectIsAdmin);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[] | null>(null);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [titleValue, seTitleValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");

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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxFiles = 4;
    const maxSize = 4 * 1024 * 1024;
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > maxFiles) {
      alert(`Maximum number of files is ${maxFiles}`);
      return;
    }
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > maxSize) {
      alert(`Total file size exceeds the limit of 4MB.`);
      return;
    }
    setImageFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      const maxFileSize = 100 * 1024 * 1024;
      if (file.size > maxFileSize) {
        alert("File size exceeds the maximum limit of 10MB.");
      } else {
        setDownloadFile(file);
      }
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const downloadfile = formData.get("downloadfile") as File;
    const imagefiles = formData.getAll("imagefiles") as File[];

    const dwdata = new FormData();
    dwdata.append("title", title);
    dwdata.append("description", description);
    if (downloadFile) dwdata.append("downloadfile", downloadFile);
    if (downloadfile) dwdata.append("downloadfile", downloadfile);
    imagefiles.forEach((file, index) =>
      dwdata.append(`imagefile_${index}`, file)
    );
    dwdata.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    // await dispatch(addPost({ title, description, image, downloadlink }));
    if (error) {
      return;
    } else {
      // reset();
      // navigate("/verify/0");
    }
  };
  const reset = () => {
    setImageFiles([]);
    setPreviews(null);
    setDownloadFile(null);
    seTitleValue("");
    setDescriptionValue("");
  };

  useEffect(() => {
    if (!isAdmin) {
      // navigate("/");
    }
  }, [isAdmin, navigate]);

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
                      onChange={handleImageFileChange}
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
                  <div className={styles.category}>Post Details</div>
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
                      <TextInput
                        label="Description"
                        name="description"
                        type="text"
                        placeholder="Please enter short description"
                        value={descriptionValue}
                        onChange={(e) => setDescriptionValue(e.target.value)}
                        required
                      />
                    </div>
                    {/* <div className={styles.row}>
                      <div className={styles.col}>
                        <div className={styles.field}>
                          <div className={styles.label}>Royalties</div>
                          <Dropdown
                            className={styles.dropdown}
                            value={royalties}
                            setValue={setRoyalties}
                            options={royaltiesOptions}
                          />
                        </div>
                      </div>
                      <div className={styles.col}>
                        <div className={styles.field}>
                          <TextInput
                            hookformprop={register("image")}
                            label="Size"
                            name="Size"
                            type="text"
                            placeholder="e. g. Size"
                            required
                          />
                          {errors?.image && (
                            <p className={styles.name}>
                              {errors.image.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={styles.col}>
                        <div className={styles.field}>
                          <TextInput
                            hookformprop={register("downloadlink")}
                            label="Propertie"
                            name="Propertie"
                            type="text"
                            placeholder="e. g. Propertie"
                            required
                          />
                          {errors?.downloadlink && (
                            <p className={styles.name}>
                              {errors.downloadlink.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>Upload File</div>
                  <div className={styles.note}>
                    Drag or choose your File to upload
                  </div>
                  <div className={styles.filedw}>
                    <input
                      className={styles.load}
                      name="downloadfile"
                      type="file"
                      accept=".zip"
                      onChange={(e) => handleFileChange(e)}
                    />
                    <div className={styles.icon}>
                      <Icon title="upload-file" size={24} />
                    </div>
                    <div className={styles.format}>ZIP. Max 100Mb.</div>
                  </div>
                </div>
              </div>

              {/* <div className={styles.options}>
                <div className={styles.option}>
                  <div className={styles.box}>
                    <div className={styles.category}>Put on sale</div>
                    <div className={styles.text}>
                      You’ll receive bids on this item
                    </div>
                  </div>
                  <Switch value={sale} setValue={setSale} />
                </div>
                <div className={styles.option}>
                  <div className={styles.box}>
                    <div className={styles.category}>Instant sale price</div>
                    <div className={styles.text}>
                      Enter the price for which the item will be instantly sold
                    </div>
                  </div>
                  <Switch value={price} setValue={setPrice} />
                </div>
                <div className={styles.option}>
                  <div className={styles.box}>
                    <div className={styles.category}>Unlock once purchased</div>
                    <div className={styles.text}>
                      Content will be unlocked after successful transaction
                    </div>
                  </div>
                  <Switch value={locking} setValue={setLocking} />
                </div>
                <div className={styles.category}>Choose collection</div>
                <div className={styles.text}>
                  Choose an exiting collection or create a new one
                </div>
                <Cards className={styles.cards} items={items} />
              </div> */}
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
                  // type="button" hide after form customization
                  type="submit"
                >
                  {isLoading ? (
                    <Loader className="" />
                  ) : (
                    <span>Create POST</span>
                  )}

                  <Icon title="arrow-next" size={10} />
                </button>
                {/* <div className={styles.saving}>
                  <span>Auto saving</span>
                  <Loader className={styles.loader} />
                </div> */}
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
            fileSize={downloadFile?.size}
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
