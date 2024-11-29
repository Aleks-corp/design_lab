// import { useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Profile.module.sass";
import Icon from "../../components/Icon";
import User from "./User";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/selectors";
// import Items from "./Items";
// import Followers from "./Followers";

// data
// import { bids } from "../../mocks/bids";

// const navLinks = [
//   "On Sale",
//   "Collectibles",
//   "Created",
//   "Likes",
//   "Following",
//   "Followers",
// ];

const Profile = () => {
  const user = useAppSelector(selectUser);
  // const [activeIndex, setActiveIndex] = useState(0);
  // const [visible, setVisible] = useState(false);

  return (
    <div className={styles.profile}>
      <div className={styles.head}>
        <div className={cn("container", styles.container)}>
          <div className={styles.btns}>
            {/* <button
              className={cn("button-stroke button-small", styles.button)}
              onClick={() => setVisible(true)}
            >
              <span>Edit cover photo</span>
              <Icon title="edit" size={16} />
            </button> */}
            <Link
              className={cn("button-stroke button-small", styles.button)}
              to="/profile-edit"
            >
              <span>Edit profile</span>
              <Icon title="image" size={16} />
            </Link>
          </div>
          {/* <div className={styles.file}>
            <input type="file" />
            <div className={styles.wrap}>
              <Icon title="upload-file" size={48} />
              <div className={styles.info}>Drag and drop your photo here</div>
              <div className={styles.text}>or click to browse</div>
            </div>
            <button
              className={cn("button-small", styles.button)}
              onClick={() => setVisible(false)}
            >
              Save photo
            </button>
          </div> */}
        </div>
      </div>
      <div className={styles.body}>
        <div className={cn("container", styles.container)}>
          <User className={styles.user} user={user} />
          <div className={styles.wrapper}>
            {/* <div className={styles.nav}>
              {navLinks.map((x, index) => (
                <button
                  className={cn(styles.link, {
                    [styles.active]: index === activeIndex,
                  })}
                  key={index}
                  onClick={() => setActiveIndex(index)}
                >
                  {x}
                </button>
              ))}
            </div> */}
            {/* <div className={styles.group}>
              <div className={styles.item}>
                {activeIndex === 0 && (
                  <Items className={styles.items} posts={bids.slice(0, 3)} />
                )}
                {activeIndex === 1 && (
                  <Items className={styles.items} posts={bids.slice(0, 6)} />
                )}
                {activeIndex === 2 && (
                  <Items className={styles.items} posts={bids.slice(0, 2)} />
                )}
                {activeIndex === 3 && (
                  <Items className={styles.items} posts={bids.slice(0, 3)} />
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
