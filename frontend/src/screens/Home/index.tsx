import { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Home.module.sass";
// import { Range, getTrackBackground } from "react-range";
// import Icon from "../../components/Icon";
import Card from "../../components/Card";
import Dropdown from "../../components/Dropdown";

// import { bids } from "../../mocks/bids";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
// import { useNavigate } from "react-router-dom";
import { addRemoveFavorites, fetchPosts } from "../../redux/posts/post.thunk";
import {
  selectCurrentFilter,
  selectIsLoading,
  selectPosts,
  selectTotalHits,
  selectUser,
} from "../../redux/selectors";
import Loader from "../../components/Loader";
import { clearPosts, setFilter } from "../../redux/posts/postSlice";

const navLinks = [
  "All products",
  "Mobile",
  "Web",
  "Dashboard",
  "UI Kits",
  "Mockups",
];

const prodListOptions = ["All products", "Favorites"];
// const likesOptions = ["Most liked", "Least liked"];
// const colorOptions = ["All colors", "Black", "Green", "Pink", "Purple"];
// const creatorOptions = ["Verified only", "All", "Most liked"];

const Home = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPosts({}));
  }, [dispatch]);

  const isLoading = useAppSelector(selectIsLoading);
  const posts = useAppSelector(selectPosts);
  const totalHits = useAppSelector(selectTotalHits);
  const currentFilter = useAppSelector(selectCurrentFilter);
  const postsPrew = posts;
  const user = useAppSelector(selectUser);
  const [prodList, setProdList] = useState(prodListOptions[0]);

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
    }
  };
  // const [likes, setLikes] = useState(likesOptions[0]);
  // const [color, setColor] = useState(colorOptions[0]);
  // const [creator, setCreator] = useState(creatorOptions[0]);

  // const [search, setSearch] = useState("");

  // const [values, setValues] = useState([5]);

  // const handleSubmit = () => {
  //   alert();
  // };

  // const STEP = 0.1;
  // const MIN = 0.01;
  // const MAX = 10;

  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
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
        {/* <div className={styles.row}> */}
        {/* <div className={styles.filters}>
            <div className={styles.range}>
              <div className={styles.label}>Price range</div>
              <Range
                values={values}
                step={STEP}
                min={MIN}
                max={MAX}
                onChange={(values) => setValues(values)}
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                      ...props.style,
                      height: "36px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <div
                      ref={props.ref}
                      style={{
                        height: "8px",
                        width: "100%",
                        borderRadius: "4px",
                        background: getTrackBackground({
                          values,
                          colors: ["#3772FF", "#E6E8EC"],
                          min: MIN,
                          max: MAX,
                        }),
                        alignSelf: "center",
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "24px",
                      width: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#3772FF",
                      border: "4px solid #FCFCFD",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-33px",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "14px",
                        lineHeight: "18px",
                        fontFamily: "Poppins",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        backgroundColor: "#141416",
                      }}
                    >
                      {values[0].toFixed(1)}
                    </div>
                  </div>
                )}
              />
              <div className={styles.scale}>
                <div className={styles.number}>0.01 ETH</div>
                <div className={styles.number}>10 ETH</div>
              </div>
            </div>
            <div className={styles.group}>
              <div className={styles.item}>
                <div className={styles.label}>Price</div>
                <Dropdown
                  className={styles.dropdown}
                  value={likes}
                  setValue={setLikes}
                  options={likesOptions}
                />
              </div>
              <div className={styles.item}>
                <div className={styles.label}>Color</div>
                <Dropdown
                  className={styles.dropdown}
                  value={color}
                  setValue={setColor}
                  options={colorOptions}
                />
              </div>
              <div className={styles.item}>
                <div className={styles.label}>Creator</div>
                <Dropdown
                  className={styles.dropdown}
                  value={creator}
                  setValue={setCreator}
                  options={creatorOptions}
                />
              </div>
            </div>
            <div className={styles.reset}>
              <Icon title="close-circle-fill" size={24} />
              <span>Reset filter</span>
            </div>
          </div> */}
        {/* <div className={styles.wrapper}> */}
        <div className={styles.list}>
          {postsPrew.length > 0 &&
            postsPrew.map((i, index) =>
              user ? (
                <Card
                  className={styles.card}
                  post={i}
                  key={index}
                  like={like}
                  userId={user.id}
                />
              ) : (
                <Card className={styles.card} post={i} key={index} />
              )
            )}
        </div>
        <div className={styles.btns}>
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

  // </div>
  // </div>
};

export default Home;
