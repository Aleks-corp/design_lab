import cn from "classnames";
import styles from "./Player.module.sass";
import Icon from "../Icon";

interface PlayerProps {
  className: string;
  item: {
    image2x: string;
    image: string;
  };
}

const Player = ({ className, item }: PlayerProps) => {
  return (
    <div className={cn(styles.player, className)}>
      <div className={styles.preview}>
        <img
          srcSet={`${item.image2x} 2x`}
          src={item.image}
          alt="Video preview"
        />
        <div className={styles.control}>
          <button className={cn(styles.button, styles.play)}>
            <Icon title="play" size={24} />
          </button>
          <div className={styles.line}>
            <div className={styles.progress} style={{ width: "20%" }}></div>
          </div>
          <div className={styles.time}>2:20</div>
          <button className={styles.button}>
            <Icon title="volume" size={24} />
          </button>
          <button className={styles.button}>
            <Icon title="full-screen" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
