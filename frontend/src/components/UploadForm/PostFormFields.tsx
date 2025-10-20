import TextInput from "../TextInput";
import TextArea from "../TextArea";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import styles from "./UploadForm.module.sass";
import { PostFormFieldsProps } from "../../types/posts.types";
import { useTranslation } from "react-i18next";

const PostFormFields: React.FC<PostFormFieldsProps> = ({
  titleValue,
  onTitleChange,
  descriptionValue,
  onDescriptionChange,
  descriptionUAValue,
  onDescriptionUAChange,
  uploadAt,
  onUploadAtChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.item}>
      <div className={styles.fieldset}>
        <div className={styles.field}>
          <TextInput
            label={t("upload.title")}
            name="title"
            type="text"
            placeholder={t("upload.title-placeholder")}
            value={titleValue}
            onChange={onTitleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <TextArea
            label={t("upload.description")}
            name="description"
            placeholder={t("upload.description-placeholder")}
            value={descriptionValue}
            onChange={onDescriptionChange}
            required
          />
        </div>
        <div className={styles.field}>
          <TextArea
            label={t("upload.descriptionUA")}
            name="descriptionUA"
            placeholder={t("upload.descriptionUA-placeholder")}
            value={descriptionUAValue}
            onChange={onDescriptionUAChange}
            required
          />
        </div>
        <div className={styles.field}>
          <p className={styles.label}>{t("upload.datetime")}</p>
          <div className={styles.wrap}>
            <Datetime
              inputProps={{
                placeholder: `${t("upload.datetime-placeholder")}`,
                className: styles.inputdate,
                required: true,
                value: uploadAt ? uploadAt : "",
              }}
              timeFormat="HH:mm"
              dateFormat="DD.MM.YYYY"
              onChange={(e) => onUploadAtChange(e.toString())}
              value={uploadAt !== "" ? new Date(uploadAt) : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFormFields;
