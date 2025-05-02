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
import Icon from "../../components/Icon";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { localLogOut } from "../../redux/auth/authSlice";
import { delToken } from "../../api/axios";

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
  const navigate = useNavigate();

  const isLoading = useAppSelector(selectIsLoading);
  const posts = useAppSelector(selectPosts);
  const totalHits = useAppSelector(selectTotalHits);
  const currentFilter = useAppSelector(selectCurrentFilter);
  const user = useAppSelector(selectUser);
  const errorPost = useAppSelector(selectPostsError);

  useEffect(() => {
    const fetchData = async () => {
      const { payload } = await dispatch(
        fetchPosts(
          prodList === prodListOptions[0]
            ? { favorites: false }
            : { favorites: true }
        )
      );
      if (payload === "Not authorized") {
        delToken();
        dispatch(localLogOut());
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    };
    dispatch(clearPosts());
    fetchData();
  }, [dispatch, navigate, prodList]);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const handleFilterClick = (filter: string) => {
    if (filter !== currentFilter) {
      dispatch(clearPosts());
      dispatch(setFilter(filter));
      dispatch(
        fetchPosts({
          page: 1,
          filter,
          favorites: prodList === prodListOptions[0] ? false : true,
          search,
        })
      );
      setCurrentPage(1);
    }
  };

  const like = (postId: string) => {
    if (user) {
      dispatch(addRemoveFavorites(postId));
      if (prodList === prodListOptions[1]) {
        dispatch(deletePostFavorites(postId));
      }
    }
  };

  const [search, setSearch] = useState("");

  const handleSearchClear = () => {
    setSearch("");
  };

  useEffect(() => {
    const controller = new AbortController();
    const timerId = setTimeout(async () => {
      setProdList(prodListOptions[0]);
      dispatch(clearPosts());
      dispatch(setFilter(""));
      const { payload } = await dispatch(fetchPosts({ search }));
      if (payload === "Not authorized") {
        delToken();
        dispatch(localLogOut());
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
      setCurrentPage(1);
    }, 1000);
    return () => {
      clearTimeout(timerId);
      controller.abort();
    };
  }, [dispatch, navigate, search]);

  if (user && user.isBlocked) {
    return (
      <div className={styles.baned}>
        <h2>
          Your account has been temporarily suspended due to policy violations.
        </h2>
      </div>
    );
  }

  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.top}>
          <div className={styles.title}>Type keywords for search</div>
          <form className={styles.search}>
            <input
              className={styles.input}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="Search ..."
            />
            {search && (
              <button
                className={styles.searchclear}
                type="reset"
                onClick={handleSearchClear}
              >
                <Icon title="close" size={12} />
              </button>
            )}

            <button className={styles.result} type="submit" disabled>
              <Icon title="search" size={16} />
            </button>
          </form>
        </div>
        <div className={styles.sorting}>
          <div className={styles.dropdown}>
            {user && (
              <Dropdown
                className={styles.dropdown}
                value={prodList}
                setValue={setProdList}
                options={prodListOptions}
              />
            )}
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
          {posts.length > 0 &&
            posts.map((i, index) =>
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
          {!isLoading && posts.length === 0 && <p>No match found</p>}
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
                        limit,
                        filter: currentFilter,
                        search,
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
