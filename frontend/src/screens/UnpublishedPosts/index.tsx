import { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./UnpublishedPosts.module.sass";
import Card from "../../components/Card";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addRemoveFavorites } from "../../redux/posts/post.thunk";
import {
  selectTotalUnpublPosts,
  selectUnpublishedPosts,
  selectUser,
  selectAdminLoadingPost,
} from "../../redux/selectors";
import Loader from "../../components/Loader";
import { getUnpublishedPosts } from "../../redux/admin/admin.thunk";

const LIMIT = 12;

const UnpublishedPosts = () => {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(selectAdminLoadingPost);
  const posts = useAppSelector(selectUnpublishedPosts);
  const totalHits = useAppSelector(selectTotalUnpublPosts);
  const user = useAppSelector(selectUser);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
    dispatch(getUnpublishedPosts({ page: 1, limit: LIMIT }));
  }, [dispatch]);

  const like = (postId: string) => {
    if (user) {
      dispatch(addRemoveFavorites(postId));
    }
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    dispatch(getUnpublishedPosts({ page: nextPage, limit: LIMIT }));
  };

  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
        {posts.length === 0 && (
          <h2 className={styles.title}>No unpublished posts</h2>
        )}
        <div className={styles.list}>
          {posts.length > 0 &&
            posts.map((i, index) =>
              user ? (
                <Card
                  className={styles.card}
                  post={i}
                  key={i._id || index}
                  like={like}
                  userId={user._id}
                />
              ) : (
                <Card className={styles.card} post={i} key={i._id || index} />
              )
            )}
        </div>
        <div className={styles.btns}>
          {isLoading ? (
            <button
              className={cn("button-stroke", styles.button)}
              type="button"
            >
              <Loader />
            </button>
          ) : (
            <>
              {totalHits > posts.length && (
                <button
                  className={cn("button-stroke", styles.button)}
                  type="button"
                  onClick={loadMore}
                >
                  <span>Load more</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnpublishedPosts;
