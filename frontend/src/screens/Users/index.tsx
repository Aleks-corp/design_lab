import { useEffect, useState } from "react";
import styles from "./Users.module.sass";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAllUsers } from "../../redux/admin/admin.thunk";
import { selectAdminUsers } from "../../redux/selectors";
import moment from "moment";

interface UserList {
  _id?: string;
  name: string;
  email: string;
  subscription: string;
  substart?: string;
  subend?: string;
}

const Users = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAdminUsers);

  const [sortField, setSortField] = useState<keyof UserList | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [updateUser, setUpdateUser] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

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
    setUpdateUser((prev) =>
      checked ? [...prev, id] : prev.filter((userId) => userId !== id)
    );
  };

  return (
    <div className={cn("container", styles.container)}>
      <div className={styles.about}>
        <p className={styles.category}>About subscription: </p>
        <p className={styles.text}>
          Free: <span>(without payment, cant download file)</span>
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
              <th className={styles.tcol} scope="col">
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
              <th className={styles.tcol} scope="col">
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
              <th className={styles.tcol} scope="col">
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
              <th className={styles.tcol} scope="col">
                Subscription start
              </th>
              <th className={styles.tcol} scope="col">
                Subscription end
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr className={styles.trow} key={user._id}>
                <th className={styles.tsel} scope="row">
                  <input
                    type="checkbox"
                    checked={updateUser.includes(user._id)}
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
                <td className={styles.tcol}>
                  {user.substart &&
                    moment(new Date(user.substart)).format("DD-MM-YYYY")}
                </td>
                <td className={styles.tcol}>
                  {user.subend &&
                    moment(new Date(user.subend)).format("DD-MM-YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
          {/* <tfoot>
          <tr>
            <th scope="row" colSpan={2}>
              Average age
            </th>
            <td>33</td>
          </tr>
        </tfoot> */}
        </table>
      )}
    </div>
  );
};
export default Users;
