import { useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Card.module.sass";
import Icon from "../Icon";

interface CardProps {
  className: string;
  post: {
    id: string;
    title: string;
    description: string;
    image: string[];
    downloadlink: string;
    filter: string[];
    favorites: string[];
    kits: string[];
  };
}

const Card = ({ className, post }: CardProps) => {
  const { id, title, description, image, kits } = post;
  const [visible, setVisible] = useState(false);

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setVisible(!visible);
  };

  return (
    <div className={cn(styles.card, className)}>
      <Link to={`/post/${id}`}>
        <div className={styles.preview}>
          {image && image.length > 0 ? (
            <div className={styles.preview4x}>
              {image.map((i, index) => {
                return index === 0 ? (
                  <div className={styles.firstRows}>
                    <img
                      key={index}
                      src={i}
                      srcSet={i}
                      alt="Uploaded Thumbnail"
                    />
                  </div>
                ) : (
                  <div className={styles.imgwrapper}>
                    <img
                      key={index}
                      src={i}
                      srcSet={i}
                      alt="Uploaded Thumbnail"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.preview}>
              <img
                src={"/images/content/postsimg/post-template.png"}
                alt="Post Template Image"
              />
            </div>
          )}
          <div className={styles.control}>
            <button
              className={cn(styles.favorite, { [styles.active]: visible })}
              onClick={handleFavoriteClick}
            >
              <Icon title="heart" size={20} />
            </button>
          </div>
        </div>
      </Link>
      <div className={styles.desc}>
        <div className={styles.body}>
          <div className={styles.line}>
            <div className={styles.title}>{title}</div>
            {/* <div className={styles.price}>{item.price}</div> */}
          </div>
          <div className={styles.line}>
            <div className={styles.kits}>
              {kits.map((i, index) => (
                <div className={styles.logo} key={index}>
                  <img
                    src={`./images/kit-logo/${i}-prog.svg`}
                    width={18}
                    alt="logo"
                  />
                </div>
              ))}
            </div>
            <Link to={`/post/${id}`}>
              <button className={styles.counter}>View Detail</button>
            </Link>
          </div>
        </div>
        <div className={styles.foot}>
          <div className={styles.description}>
            <Icon title="candlesticks-up" size={20} />
            <span>{description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
