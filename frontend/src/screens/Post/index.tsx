import { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Post.module.sass";
// import Control from "./Control";
// import Options from "./Options";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchPostById } from "../../redux/posts/post.thunk";
import { selectIsLoading, selectPost, selectUser } from "../../redux/selectors";
import Loader from "../../components/LoaderCircle";
import Icon from "../../components/Icon";

const Post = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    } else {
      navigate("/");
    }
  }, [dispatch, id, navigate]);

  const isLoading = useAppSelector(selectIsLoading);
  const post = useAppSelector(selectPost);
  const user = useAppSelector(selectUser);

  const [liked, setLiked] = useState<boolean>(
    (user && post && post.favorites.some((i) => user.id === i)) || false
  );

  return isLoading || !post ? (
    <Loader className={styles.mainloader} />
  ) : (
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <h1 className={cn("h3", styles.title)}>{post.title}</h1>
          <div className={styles.cost}>
            <div className={styles.kits}>
              {post.kits.map((i, index) => (
                <div key={index} className={styles.kit}>
                  <img src={`/images/kit-logo/${i}-prog.svg`} alt="Logo" />
                </div>
              ))}
            </div>
            <div className={styles.download}>
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    return;
                  }
                  setLiked(!liked);
                }}
                className={styles.like}
              >
                <p className={styles.liketext}>{post.favorites.length}</p>
                {liked ? (
                  <Icon title={"heart-fill"} size={28} />
                ) : (
                  <Icon title={"heart"} size={28} />
                )}
              </button>
              <p className={styles.size}>{`${(
                Number(post.filesize) /
                1024 /
                1024
              ).toFixed(2)} Mb`}</p>
              {user && user.subscription !== "free" && (
                <NavLink
                  className={cn("button", styles.button)}
                  to={post.downloadlink}
                  download
                >
                  Download
                </NavLink>
              )}
            </div>
          </div>
          {(!user || user.subscription === "free") && (
            <div className={styles.info}>
              You can download this product with the All-Access Pass.
              <button className={cn("button", styles.button)} type="button">
                Get All-Access
              </button>
            </div>
          )}
        </div>
        <div className={cn("container", styles.imgcontainer)}>
          {post.image.map((img, index) => (
            <div key={index} className={styles.preview}>
              <img src={img} alt="Item" />
            </div>
          ))}
        </div>
        <div className={cn("container", styles.container)}>
          <h2>Description</h2>
          <p>{post.description}</p>
        </div>
      </div>
    </>
  );
};

export default Post;
