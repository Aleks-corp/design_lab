import { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Home.module.sass";
import Card from "../../components/Card";
import Dropdown from "../../components/Dropdown";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addRemoveFavorites, fetchPosts } from "../../redux/posts/post.thunk";
import {
  selectCurrentFilter,
  selectIsLoading,
  selectPosts,
  selectTotalHits,
  selectUser,
  selectPostsError,
} from "../../redux/selectors";
import Loader from "../../components/Loader";
import {
  clearPosts,
  setFilter,
  deletePostFavorites,
} from "../../redux/posts/postSlice";
// import Icon from "../../components/Icon";

const navLinks = [
  "All products",
  "Mobile",
  "Web",
  "Dashboard",
  "UI Kits",
  "Mockups",
];

const prodListOptions = ["All products", "Favorites"];

const Home = () => {
  const [prodList, setProdList] = useState(prodListOptions[0]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearPosts());
    dispatch(
      fetchPosts(
        prodList === "All products" ? { favorites: false } : { favorites: true }
      )
    );
  }, [dispatch, prodList]);

  const isLoading = useAppSelector(selectIsLoading);
  const posts = useAppSelector(selectPosts);
  const totalHits = useAppSelector(selectTotalHits);
  const currentFilter = useAppSelector(selectCurrentFilter);
  const postsPrew = posts;
  const user = useAppSelector(selectUser);
  const errorPost = useAppSelector(selectPostsError);

  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterClick = (filter: string) => {
    if (filter !== currentFilter) {
      dispatch(clearPosts());
      dispatch(setFilter(filter));
      dispatch(fetchPosts({ page: 1, filter }));
      setCurrentPage(1);
    }
  };

  const like = (postId: string) => {
    if (user) {
      dispatch(addRemoveFavorites(postId));
      if (prodList === "Favorites") {
        dispatch(deletePostFavorites(postId));
      }
    }
  };

  // const [search, setSearch] = useState("");

  // const handleSubmit = () => {
  //   alert();
  // };

  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
        {/* SEARCH */}
        {/* <div className={styles.top}>
          <div className={styles.title}>Type your keywords</div>
          <form
            className={styles.search}
            action=""
            onSubmit={() => handleSubmit()}
          >
            <input
              className={styles.input}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="Search ..."
              required
            />
            <button className={styles.result}>
              <Icon title="search" size={16} />
            </button>
          </form>
        </div> */}
        <div className={styles.sorting}>
          <div className={styles.dropdown}>
            <Dropdown
              className={styles.dropdown}
              value={prodList}
              setValue={setProdList}
              options={prodListOptions}
            />
          </div>
          <div className={styles.nav}>
            {navLinks.map((filter) => (
              <button
                className={cn(styles.link, {
                  [styles.active]: filter === currentFilter,
                })}
                onClick={() => {
                  handleFilterClick(filter);
                }}
                key={filter}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.list}>
          {postsPrew.length > 0 &&
            postsPrew.map((i, index) =>
              user ? (
                <Card
                  className={styles.card}
                  post={i}
                  key={index}
                  like={like}
                  userId={user._id}
                />
              ) : (
                <Card className={styles.card} post={i} key={index} />
              )
            )}
        </div>
        <div className={styles.btns}>
          {errorPost && typeof errorPost === "string" && <p>{errorPost}</p>}
          {isLoading ? (
            <button
              className={cn("button-stroke", styles.button)}
              type="button"
              disabled
            >
              <Loader />
            </button>
          ) : (
            <>
              {totalHits > posts.length && (
                <button
                  className={cn("button-stroke", styles.button)}
                  type="button"
                  onClick={() => {
                    const nextPage = currentPage + 1;
                    setCurrentPage(nextPage);
                    dispatch(
                      fetchPosts({
                        page: nextPage,
                        limit: 1,
                        filter: currentFilter,
                      })
                    );
                  }}
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

export default Home;
