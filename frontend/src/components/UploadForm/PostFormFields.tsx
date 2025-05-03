import TextInput from "../TextInput";
import TextArea from "../TextArea";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import styles from "./UploadForm.module.sass";
import { PostFormFieldsProps } from "../../types/posts.types";

const PostFormFields: React.FC<PostFormFieldsProps> = ({
  titleValue,
  onTitleChange,
  descriptionValue,
  onDescriptionChange,
  uploadAt,
  onUploadAtChange,
}) => (
  <div className={styles.item}>
    <div className={styles.fieldset}>
      <div className={styles.field}>
        <TextInput
          label="Post title"
          name="title"
          type="text"
          placeholder="Please enter Post title"
          value={titleValue}
          onChange={onTitleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <TextArea
          label="Description"
          name="description"
          placeholder="Please enter short description"
          value={descriptionValue}
          onChange={onDescriptionChange}
          required
        />
      </div>
      <div className={styles.field}>
        <p className={styles.label}>Datetime to upload</p>
        <div className={styles.wrap}>
          <Datetime
            inputProps={{
              placeholder: "Select upload Date",
              className: styles.inputdate,
              required: true,
              value: uploadAt ? uploadAt : "",
            }}
            onChange={(e) => onUploadAtChange(e.toString())}
            value={uploadAt !== "" ? new Date(uploadAt) : ""}
          />
        </div>
      </div>
    </div>
  </div>
);

export default PostFormFields;
