import React, { useEffect, useState } from "react";
import styles from "./Users.module.sass";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAllUsers,
  patchUsers,
  banUsers,
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

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    subscription: true,
    status: true,
    lastPayedStatus: true,
    lastPayedDate: true,
    orderReference: true,
    substart: true,
    subend: true,
    regularDateEnd: true,
    phone: true,
    amount: true,
    mode: true,
    isBlocked: true,
  });

  const handleToggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

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

  const handleSort = (field: keyof UserList | "") => {
    if (field === "") {
      setSortField("");
      setSortDirection("asc");
    }
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
          Sale: <span>(1 day subscription, can download 2 files per day)</span>
        </p>
        <p className={styles.text}>
          Admin:{" "}
          <span>
            (All access, can upload/delete post, change users subscription)
          </span>
        </p>
      </div>
      <div className={styles.checkboxes}>
        {Object.keys(visibleColumns).map((key, index, array) => (
          <React.Fragment key={key}>
            <label>
              <input
                type="checkbox"
                checked={visibleColumns[key as keyof typeof visibleColumns]}
                onChange={() =>
                  handleToggleColumn(key as keyof typeof visibleColumns)
                }
              />
              <span>{key}</span>
            </label>
            {index < array.length - 1 && (
              <span className={styles.separator}>|</span>
            )}
          </React.Fragment>
        ))}
      </div>
      {users.length > 0 && (
        <>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.trow}>
                  <th className={styles.tsel} scope="col">
                    <button
                      className={styles.selectbtn}
                      type="button"
                      onClick={() => handleSort("")}
                    >
                      Set
                    </button>
                  </th>
                  {visibleColumns.name && (
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
                  )}
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

                  {visibleColumns.subscription && (
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
                  )}
                  {visibleColumns.status && (
                    <th className={styles.th} scope="col">
                      Status
                    </th>
                  )}
                  {visibleColumns.lastPayedStatus && (
                    <th className={styles.th} scope="col">
                      Last_Payed Status
                    </th>
                  )}
                  {visibleColumns.lastPayedDate && (
                    <th className={styles.th} scope="col">
                      Last_Payed Date
                    </th>
                  )}
                  {visibleColumns.orderReference && (
                    <th className={styles.th} scope="col">
                      Order Reference
                    </th>
                  )}
                  {visibleColumns.substart && (
                    <th className={styles.th} scope="col">
                      Subscription start
                    </th>
                  )}
                  {visibleColumns.subend && (
                    <th className={styles.th} scope="col">
                      Subscription end
                    </th>
                  )}
                  {visibleColumns.regularDateEnd && (
                    <th className={styles.th} scope="col">
                      Subscription Until
                    </th>
                  )}
                  {visibleColumns.phone && (
                    <th className={styles.th} scope="col">
                      Phone
                    </th>
                  )}
                  {visibleColumns.amount && (
                    <th className={styles.th} scope="col">
                      Amount
                    </th>
                  )}
                  {visibleColumns.mode && (
                    <th className={styles.th} scope="col">
                      Payment period
                    </th>
                  )}
                  {visibleColumns.isBlocked && (
                    <th className={styles.th} scope="col">
                      Is Baned
                    </th>
                  )}
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
                    {visibleColumns.name && (
                      <td className={styles.tcol}>{user.name}</td>
                    )}
                    <td className={styles.tcol}>{user.email}</td>
                    {visibleColumns.subscription && (
                      <td
                        className={cn(styles.tcol, {
                          [styles.free]: user.subscription === "free",
                          [styles.member]: user.subscription === "member",
                          [styles.admin]: user.subscription === "admin",
                          [styles.sale]: user.subscription === "sale",
                        })}
                      >
                        {user.subscription}
                      </td>
                    )}
                    {visibleColumns.status && (
                      <td className={styles.tcol}>{user.status}</td>
                    )}
                    {visibleColumns.lastPayedStatus && (
                      <td className={styles.tcol}>{user.lastPayedStatus}</td>
                    )}
                    {visibleColumns.lastPayedDate && (
                      <td className={styles.tcol}>
                        {user.lastPayedDate &&
                          moment(new Date(user.lastPayedDate)).format(
                            "DD-MM-YYYY"
                          )}
                      </td>
                    )}
                    {visibleColumns.orderReference && (
                      <td className={styles.tcol}>{user.orderReference}</td>
                    )}
                    {visibleColumns.substart && (
                      <td className={styles.tcol}>
                        {user.substart &&
                          moment(new Date(user.substart)).format("DD-MM-YYYY")}
                      </td>
                    )}
                    {visibleColumns.subend && (
                      <td className={styles.tcol}>
                        {user.subend &&
                          moment(new Date(user.subend)).format("DD-MM-YYYY")}
                      </td>
                    )}
                    {visibleColumns.regularDateEnd && (
                      <td className={styles.tcol}>
                        {user.regularDateEnd &&
                          moment(new Date(user.regularDateEnd)).format(
                            "DD-MM-YYYY"
                          )}
                      </td>
                    )}
                    {visibleColumns.phone && (
                      <td className={styles.tcol}>{user.phone}</td>
                    )}
                    {visibleColumns.amount && (
                      <td className={styles.tcol}>{user.amount}</td>
                    )}
                    {visibleColumns.mode && (
                      <td className={styles.tcol}>{user.mode}</td>
                    )}
                    {visibleColumns.isBlocked && (
                      <td
                        className={cn(styles.tcol, {
                          [styles.ban]: user.isBlocked,
                        })}
                      >
                        {user.isBlocked && "BAN"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  {
                    <td className={styles.tselected} colSpan={1}>
                      {updateUsers.length > 0 && updateUsers.length}
                    </td>
                  }
                </tr>
              </tfoot>
            </table>
          </div>

          {updateUsers.length > 0 && (
            <div className={styles.btnContainer}>
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
                  Set sub-tion for 1 month
                </button>
              )}
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
                      banUsers({
                        usersId: updateUsers,
                      })
                    );
                  }}
                >
                  Ban | Unban
                </button>
              )}
            </div>
          )}
        </>
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
