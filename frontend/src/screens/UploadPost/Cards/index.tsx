import styles from "./Cards.module.sass";
import cn from "classnames";
import Icon from "../../../components/Icon";

interface CardsProps {
  className: string;
  items: {
    color: string;
    title: string;
  }[];
}

const Cards = ({ className, items }: CardsProps) => {
  return (
    <div className={cn(className, styles.cards)}>
      {items.map((x, index) => (
        <div className={styles.card} key={index}>
          <div className={styles.plus} style={{ backgroundColor: x.color }}>
            <Icon title="plus" size={24} />
          </div>
          <div className={styles.subtitle}>{x.title}</div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
