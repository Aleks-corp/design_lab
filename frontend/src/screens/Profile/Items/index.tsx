import cn from "classnames";
import styles from "./Items.module.sass";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";
import { GetPost } from "../../../types/posts.types";

interface ItemsProps {
  className: string;
  posts: GetPost[];
}

const Items = ({ className, posts }: ItemsProps) => {
  return (
    <div className={cn(styles.items, className)}>
      <div className={styles.list}>
        {posts.map((x, index) => (
          <Card className={styles.card} post={x} key={index} />
        ))}
      </div>
      <Loader className={styles.loader} />
    </div>
  );
};

export default Items;
