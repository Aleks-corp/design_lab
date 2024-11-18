import { useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Card.module.sass";
import Icon from "../Icon";

interface CardProps {
  className: string;
  item: {
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
  };
}

const Card = ({ className, item }: CardProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.preview}>
        <img srcSet={`${item.image2x} 2x`} src={item.image} alt="Card" />
        <div className={styles.control}>
          <div
            className={cn(
              { "status-green": item.category === "green" },
              styles.category
            )}
          >
            {item.categoryText}
          </div>
          <button
            className={cn(styles.favorite, { [styles.active]: visible })}
            onClick={() => setVisible(!visible)}
          >
            <Icon title="heart" size={20} />
          </button>
          <button className={cn("button-small", styles.button)}>
            <span>Place a bid</span>
            <Icon title="scatter-up" size={16} />
          </button>
        </div>
      </div>
      <Link className={styles.link} to={item.url}>
        <div className={styles.body}>
          <div className={styles.line}>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.price}>{item.price}</div>
          </div>
          <div className={styles.line}>
            <div className={styles.users}>
              {item.users.map((x, index) => (
                <div className={styles.avatar} key={index}>
                  <img src={x.avatar} alt="Avatar" />
                </div>
              ))}
            </div>
            <div className={styles.counter}>{item.counter}</div>
          </div>
        </div>
        <div className={styles.foot}>
          <div className={styles.status}>
            <Icon title="candlesticks-up" size={20} />
            Highest bid <span>{item.highestBid}</span>
          </div>
          <div
            className={styles.bid}
            dangerouslySetInnerHTML={{ __html: item.bid }}
          />
        </div>
      </Link>
    </div>
  );
};

export default Card;
