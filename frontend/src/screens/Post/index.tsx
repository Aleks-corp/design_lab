import { SetStateAction, useEffect } from "react";
import cn from "classnames";
import styles from "./Post.module.sass";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addRemoveFavorites,
  deletePost,
  fetchPostById,
} from "../../redux/posts/post.thunk";
import {
  selectIsAdmin,
  selectIsLoading,
  selectPost,
  selectUser,
} from "../../redux/selectors";
import Loader from "../../components/LoaderCircle";
import Icon from "../../components/Icon";
import { clearPost } from "../../redux/posts/postSlice";
import Control from "../../components/Control";
import moment from "moment";
import toast from "react-hot-toast";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Post",
  },
];

const Post = ({
  setDate,
}: {
  setDate: React.Dispatch<SetStateAction<Date>>;
}) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const SubmitPayment = () => {
    const currentDate = new Date();
    setDate(currentDate);
    navigate("/payment");
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    } else {
      navigate("/");
    }
    return () => {
      dispatch(clearPost());
    };
  }, [dispatch, id, navigate]);

  const isLoading = useAppSelector(selectIsLoading);
  const post = useAppSelector(selectPost);
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);

  const like = (postId: string) => {
    if (user) {
      dispatch(addRemoveFavorites(postId));
    }
  };

  return (
    <>
      <Control className={styles.control} item={breadcrumbs} />
      {isLoading && <Loader className={styles.mainloader} />}
      {!isLoading && post && (
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
                    like(post._id);
                  }}
                  className={styles.like}
                >
                  <p className={styles.liketext}>{post.favorites.length}</p>
                  {post.favorites.some((i) => user?._id === i) ? (
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
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(deletePost(post._id));
                      navigate(-1);
                    }}
                    className={styles.delete}
                  >
                    <Icon title={"close-circle-fill"} size={28} />
                    <p className={styles.deletetext}>Delete Post</p>
                  </button>
                )}
              </div>
            </div>
            <div>
              {post.category.map((i) => (
                <p className={styles.category} key={i}>
                  {i}
                </p>
              ))}
            </div>
            {(!user ||
              (user.subscription === "free" &&
                user.lastPayedStatus !== "Declined")) && (
              <div className={styles.info}>
                You can download this product with the All-Access Pass.
                <button
                  className={cn("button", styles.button)}
                  type="button"
                  onClick={() =>
                    user ? SubmitPayment() : toast.error("sign in first")
                  }
                >
                  Get All-Access
                </button>
              </div>
            )}
            {user &&
              user.subscription === "free" &&
              user.lastPayedStatus === "Declined" && (
                <div className={styles.infoprofile}>
                  Unfortunately, your last payment was declined. More info in{" "}
                  <Link className={styles.linkprofile} to={"/profile"}>
                    Profile
                  </Link>
                </div>
              )}
          </div>
          <div className={cn("container", styles.imgcontainer)}>
            {post.images.map((img, index) => (
              <div key={index} className={styles.preview}>
                <img
                  src={img}
                  alt="Post Image"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/content/postsimg/post-template.jpg";
                  }}
                />
              </div>
            ))}
          </div>
          <div className={cn("container", styles.container)}>
            <h2>Description</h2>
            <p>{post.description}</p>
          </div>
          <div className={cn("container", styles.created)}>
            <span>
              Post created:{" "}
              <span>
                {moment(new Date(post.upload_at)).format("DD MMM YYYY HH:mm")}
              </span>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
