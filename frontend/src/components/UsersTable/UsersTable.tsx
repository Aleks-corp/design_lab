import { SetStateAction, useEffect, useState } from "react";
import styles from "./UsersTable.module.sass";
import cn from "classnames";
import { useAppSelector } from "../../redux/hooks";

import { selectAdminUsers } from "../../redux/selectors";
import moment from "moment";
import {
  ColumnConfig,
  ColumnId,
  ColumnState,
  UserList,
} from "../../types/user.types";

import {
  RiUserLine,
  RiMailLine,
  RiVipCrownLine,
  RiShieldCheckLine,
  RiBillLine,
  RiCalendarCheckLine,
  RiHashtag,
  RiPlayLine,
  RiStopLine,
  RiTimerLine,
  RiPhoneLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiForbidLine,
} from "react-icons/ri";

const UsersTable = ({
  currentPage,
  updateUsers,
  setUpdateUsers,
}: {
  currentPage: number;
  updateUsers: string[];
  setUpdateUsers: React.Dispatch<SetStateAction<string[]>>;
}) => {
  const users = useAppSelector(selectAdminUsers);

  const [sortField, setSortField] = useState<keyof UserList | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const USERS_PER_PAGE = 50;

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

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setUpdateUsers((prev) =>
      checked ? [...prev, id] : prev.filter((userId) => userId !== id)
    );
  };

  const COLUMNS: ColumnConfig[] = [
    {
      id: "name",
      label: "Name",
      icon: <RiUserLine size="1.5em" />,
      render: (u) => u.name,
      sortKey: "name",
    },
    {
      id: "email",
      label: "Email",
      icon: <RiMailLine size="1.5em" />,
      render: (u) => u.email,
      sortKey: "email",
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: <RiVipCrownLine size="1.5em" />,
      render: (u) => u.subscription,
      sortKey: "subscription",
    },
    {
      id: "status",
      label: "Status",
      icon: <RiShieldCheckLine size="1.5em" />,
      render: (u) => u.status,
    },
    {
      id: "lastPayedStatus",
      label: "LastPaid Status",
      icon: <RiBillLine size="1.5em" />,
      render: (u) => u.lastPayedStatus,
    },
    {
      id: "lastPayedDate",
      label: "LastPaid Date",
      icon: <RiCalendarCheckLine size="1.5em" />,
      render: (u) =>
        u.lastPayedDate && moment(u.lastPayedDate).format("DD-MM-YYYY"),
    },
    {
      id: "orderReference",
      label: "Order Ref",
      icon: <RiHashtag size="1.5em" />,
      render: (u) => u.orderReference,
    },
    {
      id: "substart",
      label: "Sub Start",
      icon: <RiPlayLine size="1.5em" />,
      render: (u) => u.substart && moment(u.substart).format("DD-MM-YYYY"),
    },
    {
      id: "subend",
      label: "Sub End",
      icon: <RiStopLine size="1.5em" />,
      render: (u) => u.subend && moment(u.subend).format("DD-MM-YYYY"),
    },
    {
      id: "regularDateEnd",
      label: "Subscription Until",
      icon: <RiTimerLine size="1.5em" />,
      render: (u) =>
        u.regularDateEnd && moment(u.regularDateEnd).format("DD-MM-YYYY"),
    },
    {
      id: "phone",
      label: "Phone",
      icon: <RiPhoneLine size="1.5em" />,
      render: (u) => u.phone,
    },
    {
      id: "amount",
      label: "Amount",
      icon: <RiMoneyDollarCircleLine size="1.5em" />,
      render: (u) => u.amount,
    },
    {
      id: "mode",
      label: "Period",
      icon: <RiTimeLine size="1.5em" />,
      render: (u) => u.mode,
    },
    {
      id: "isBlocked",
      label: "Banned",
      icon: <RiForbidLine size="1.5em" />,
      render: (u) => (u.isBlocked ? "BAN" : ""),
    },
  ];

  const [colState, setColState] = useState<Record<ColumnId, ColumnState>>(
    () => {
      const saved = localStorage.getItem("users_table_colstate");
      return saved
        ? JSON.parse(saved)
        : COLUMNS.reduce((acc, c) => {
            acc[c.id] = "full";
            return acc;
          }, {} as Record<ColumnId, ColumnState>);
    }
  );

  useEffect(() => {
    localStorage.setItem("users_table_colstate", JSON.stringify(colState));
  }, [colState]);

  const toggleCollapse = (id: ColumnId) => {
    setColState((s) => ({
      ...s,
      [id]: s[id] === "full" ? "collapsed" : "full",
    }));
  };

  return (
    users.length > 0 && (
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={styles.iconsRow}>
              <th className={styles.ticon} /> {/* для чекбоксу "Set" */}
              {COLUMNS.map((col) => (
                <th
                  key={col.id}
                  className={cn(styles.thIcon, {
                    [styles.collapsed]: colState[col.id] === "collapsed",
                  })}
                  title={
                    colState[col.id] === "collapsed"
                      ? `Expand ${col.label}`
                      : `Collapse ${col.label}`
                  }
                  onClick={() => toggleCollapse(col.id)}
                >
                  {col.icon}
                </th>
              ))}
            </tr>
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
              {COLUMNS.map((col) => (
                <th
                  key={col.id}
                  className={cn(styles.th, {
                    [styles.collapsed]: colState[col.id] === "collapsed",
                  })}
                  scope="col"
                >
                  <button
                    className={styles.selectbtn}
                    type="button"
                    onClick={() =>
                      col.sortKey ? handleSort(col.sortKey) : undefined
                    }
                  >
                    {col.label}
                    {sortField === col.sortKey
                      ? sortDirection === "asc"
                        ? " ↑"
                        : " ↓"
                      : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
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
                {COLUMNS.map((col) => (
                  <td
                    key={col.id}
                    className={cn(styles.tcol, {
                      [styles.collapsed]: colState[col.id] === "collapsed",
                      // приклад: клас для кольорового беджу subscription
                      [styles.free]:
                        col.id === "subscription" &&
                        user.subscription === "free",
                      [styles.member]:
                        col.id === "subscription" &&
                        user.subscription === "member",
                      [styles.admin]:
                        col.id === "subscription" &&
                        user.subscription === "admin",
                      [styles.sale]:
                        col.id === "subscription" &&
                        user.subscription === "sale",
                      [styles.ban]: col.id === "isBlocked" && user.isBlocked,
                    })}
                    title={
                      colState[col.id] === "collapsed" ? col.label : undefined
                    }
                  >
                    <div className={styles.cellContent}>{col.render(user)}</div>
                  </td>
                ))}
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
    )
  );
};
export default UsersTable;
