import { useEffect, useState } from "react";
import styles from "./Users.module.sass";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAllUsers,
  patchUsers,
  patchCheckSub,
} from "../../redux/admin/admin.thunk";
import {
  selectAdminUsers,
  selectTotalFolowers,
  selectAdminLoadingMore,
  selectAdminLoadingUpdate,
  selectAdminLoadingCheck,
} from "../../redux/selectors";
import moment from "moment";
import Loader from "../../components/Loader";

interface UserList {
  _id?: string;
  name: string;
  email: string;
  subscription: string;
}

const Users = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAdminUsers);
  const totalUsers = useAppSelector(selectTotalFolowers);
  const isLoadingMore = useAppSelector(selectAdminLoadingMore);
  const isLoadingUpdate = useAppSelector(selectAdminLoadingUpdate);
  const isLoadingCheck = useAppSelector(selectAdminLoadingCheck);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof UserList | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [updateUsers, setUpdateUsers] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getAllUsers({}));
  }, [dispatch]);

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(
      `.${styles.scroll}`
    );
    if (!scrollContainer) return;
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      scrollContainer.classList.add("active");
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      scrollContainer.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown = false;
      scrollContainer.classList.remove("active");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 1;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    scrollContainer.addEventListener("mousedown", handleMouseDown);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("mouseup", handleMouseUp);
    scrollContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      scrollContainer.removeEventListener("mousedown", handleMouseDown);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("mouseup", handleMouseUp);
      scrollContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSort = (field: keyof UserList) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setUpdateUsers((prev) =>
      checked ? [...prev, id] : prev.filter((userId) => userId !== id)
    );
  };

  return (
    <div className={cn("container", styles.container)}>
      <div className={styles.about}>
        <p className={styles.category}>About subscription: </p>
        <p className={styles.text}>
          Free: <span>(without payment, can not download file)</span>
        </p>
        <p className={styles.text}>
          Member:{" "}
          <span>(payment until end subscription, can download file)</span>
        </p>
        <p className={styles.text}>
          Admin:{" "}
          <span>
            (All access, can upload/delete post, change users subscription)
          </span>
        </p>
      </div>
      {users.length > 0 && (
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.trow}>
                <th className={styles.tsel} scope="col">
                  <button
                    className={styles.selectbtn}
                    type="button"
                    //   onClick={() => handleSort("")}
                  >
                    Select
                  </button>
                </th>
                <th className={styles.th} scope="col">
                  <button
                    className={styles.selectbtn}
                    type="button"
                    onClick={() => handleSort("name")}
                  >
                    Name{" "}
                    {sortField === "name"
                      ? sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </button>
                </th>
                <th className={styles.th} scope="col">
                  <button
                    className={styles.selectbtn}
                    type="button"
                    onClick={() => handleSort("email")}
                  >
                    Email{" "}
                    {sortField === "email"
                      ? sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </button>
                </th>

                <th className={styles.th} scope="col">
                  <button
                    className={styles.selectbtn}
                    type="button"
                    onClick={() => handleSort("subscription")}
                  >
                    Subscription{" "}
                    {sortField === "subscription"
                      ? sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </button>
                </th>
                <th className={styles.th} scope="col">
                  Status
                </th>
                <th className={styles.th} scope="col">
                  Last_Payed Status
                </th>
                <th className={styles.th} scope="col">
                  Last_Payed Date
                </th>
                <th className={styles.th} scope="col">
                  Order Reference
                </th>
                <th className={styles.th} scope="col">
                  Subscription start
                </th>
                <th className={styles.th} scope="col">
                  Subscription end
                </th>
                <th className={styles.th} scope="col">
                  Subscription Until
                </th>
                <th className={styles.th} scope="col">
                  Phone
                </th>
                <th className={styles.th} scope="col">
                  Amount
                </th>
                <th className={styles.th} scope="col">
                  Payment period
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr className={styles.trow} key={user._id}>
                  <th className={styles.tsel} scope="row">
                    <input
                      type="checkbox"
                      checked={updateUsers.includes(user._id)}
                      onChange={(e) =>
                        handleCheckboxChange(user._id, e.target.checked)
                      }
                    />
                  </th>
                  <td className={styles.tcol}>{user.name}</td>
                  <td className={styles.tcol}>{user.email}</td>
                  <td
                    className={cn(styles.tcol, {
                      [styles.free]: user.subscription === "free",
                      [styles.member]: user.subscription === "member",
                      [styles.admin]: user.subscription === "admin",
                    })}
                  >
                    {user.subscription}
                  </td>
                  <td className={styles.tcol}>{user.status}</td>
                  <td className={styles.tcol}>{user.lastPayedStatus}</td>
                  <td className={styles.tcol}>
                    {user.lastPayedDate &&
                      moment(new Date(user.lastPayedDate)).format("DD-MM-YYYY")}
                  </td>
                  <td className={styles.tcol}>{user.orderReference}</td>
                  <td className={styles.tcol}>
                    {user.substart &&
                      moment(new Date(user.substart)).format("DD-MM-YYYY")}
                  </td>
                  <td className={styles.tcol}>
                    {user.subend &&
                      moment(new Date(user.subend)).format("DD-MM-YYYY")}
                  </td>
                  <td className={styles.tcol}>
                    {user.regularDateEnd &&
                      moment(new Date(user.regularDateEnd)).format(
                        "DD-MM-YYYY"
                      )}
                  </td>
                  <td className={styles.tcol}>{user.phone}</td>
                  <td className={styles.tcol}>{user.amount}</td>
                  <td className={styles.tcol}>{user.mode}</td>
                </tr>
              ))}
            </tbody>
            {updateUsers.length > 0 && (
              <tfoot>
                <tr>
                  <td className={styles.tselected} colSpan={1}>
                    {updateUsers.length}
                  </td>
                  <th className={styles.tcol} scope="row" colSpan={3}>
                    {isLoadingUpdate ? (
                      <button
                        className={cn("button-stroke", styles.button)}
                        type="button"
                      >
                        <Loader />
                      </button>
                    ) : (
                      <button
                        className={cn("button-stroke", styles.updateBtn)}
                        type="button"
                        onClick={() => {
                          dispatch(
                            patchUsers({
                              usersId: updateUsers,
                              subscription: "member",
                            })
                          );
                        }}
                      >
                        Set membership 1 month
                      </button>
                    )}
                  </th>
                  <th className={styles.tcol} scope="row" colSpan={3}>
                    {isLoadingUpdate ? (
                      <button
                        className={cn("button-stroke", styles.button)}
                        type="button"
                      >
                        <Loader />
                      </button>
                    ) : (
                      <button
                        className={cn("button-stroke", styles.updateBtnRed)}
                        type="button"
                        onClick={() => {
                          dispatch(
                            patchUsers({
                              usersId: updateUsers,
                              subscription: "free",
                            })
                          );
                        }}
                      >
                        Delete subscription
                      </button>
                    )}
                  </th>
                  <th className={styles.tcol} scope="row" colSpan={3}>
                    {isLoadingCheck ? (
                      <button
                        className={cn("button-stroke", styles.button)}
                        type="button"
                      >
                        <Loader />
                      </button>
                    ) : (
                      <button
                        className={cn("button-stroke", styles.updateBtn)}
                        type="button"
                        onClick={() => {
                          dispatch(
                            patchCheckSub({
                              usersId: updateUsers,
                            })
                          );
                        }}
                      >
                        Check WayForPay status
                      </button>
                    )}
                  </th>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
      <div className={styles.btns}>
        {isLoadingMore ? (
          <button className={cn("button-stroke", styles.button)} type="button">
            <Loader />
          </button>
        ) : (
          <>
            {totalUsers > users.length && (
              <button
                className={cn("button-stroke", styles.button)}
                type="button"
                onClick={() => {
                  const nextPage = currentPage + 1;
                  setCurrentPage(nextPage);
                  dispatch(
                    getAllUsers({
                      page: nextPage,
                      limit: 50,
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
  );
};
export default Users;
