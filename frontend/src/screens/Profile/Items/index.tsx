import cn from "classnames";
import styles from "./Items.module.sass";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";

interface ItemsProps {
  className: string;
  items: {
    title: string;
    price: string;
    highestBid: string;
    counter: string;
    bid: string;
    image: string;
    image2x: string;
    category: string;
    categoryText: string;
    url: string;
    users: {
      avatar: string;
    }[];
  }[];
}

const Items = ({ className, items }: ItemsProps) => {
  return (
    <div className={cn(styles.items, className)}>
      <div className={styles.list}>
        {items.map((x, index) => (
          <Card className={styles.card} item={x} key={index} />
        ))}
      </div>
      <Loader className={styles.loader} />
    </div>
  );
};

export default Items;
