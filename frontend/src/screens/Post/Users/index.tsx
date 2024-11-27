import cn from "classnames";
import styles from "./Users.module.sass";

interface UsersProps {
  className: string;
  items: {
    name: string;
    position: string;
    avatar: string;
    reward?: string;
  }[];
}

const Users = ({ className, items }: UsersProps) => {
  return (
    <div className={cn(styles.users, className)}>
      <div className={styles.list}>
        {items.map((x, index) => (
          <div className={styles.item} key={index}>
            <div className={styles.avatar}>
              <img src={x.avatar} alt="Avatar" />
              {x.reward && (
                <div className={styles.reward}>
                  <img src={x.reward} alt="Reward" />
                </div>
              )}
            </div>
            <div className={styles.details}>
              <div className={styles.position}>{x.position}</div>
              <div className={styles.name}>{x.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
