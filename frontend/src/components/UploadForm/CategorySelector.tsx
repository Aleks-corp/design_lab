import Switch from "../Switch";
import styles from "./UploadPost.module.sass";

interface CategorySelectorProps {
  title: string;
  items: { [key: string]: boolean }[];
  setItems: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }[]>>;
  constants: string[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  title,
  items,
  setItems,
  constants,
}) => (
  <>
    <p className={styles.text}>{title}</p>
    <div className={styles.filteroptions}>
      {constants.map((item, index) => (
        <div key={index} className={styles.filteroption}>
          <Switch
            value={
              items.find((i) => Object.keys(i)[0] === item)?.[item] || false
            }
            setValue={(newValue) =>
              setItems((prevItems) =>
                prevItems.map((i) =>
                  Object.keys(i)[0] === item ? { [item]: newValue } : i
                )
              )
            }
          />
          <div className={styles.box}>
            <p className={styles.category}>{item}</p>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default CategorySelector;
