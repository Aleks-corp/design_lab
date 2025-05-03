import Switch from "../Switch";
import styles from "./UploadForm.module.sass";

interface SwitchSelectorProps {
  title: string;
  items: { [key: string]: boolean }[];
  setItems: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }[]>>;
  constants: string[];
  optionClass: string;
  containerClass: string;
  showBox?: boolean;
}

const SwitchSelector: React.FC<SwitchSelectorProps> = ({
  title,
  items,
  setItems,
  constants,
  optionClass,
  containerClass,
  showBox = false,
}) => {
  return (
    <>
      <p className={styles.text}>{title}</p>
      <div className={containerClass}>
        {constants.map((item, index) => (
          <div key={index} className={optionClass}>
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
              name={title === "Kits" ? item : ""}
            />
            {showBox && (
              <div className={styles.box}>
                <p className={styles.category}>{item}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SwitchSelector;
