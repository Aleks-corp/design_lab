import { useEffect, useState } from "react";
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
import Loader from "../../components/Loader";

import UsersTable from "../../components/UsersTable/UsersTable";

const Users = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAdminUsers);
  const totalUsers = useAppSelector(selectTotalFolowers);
  const isLoadingMore = useAppSelector(selectAdminLoadingMore);
  const isLoadingUpdate = useAppSelector(selectAdminLoadingUpdate);
  const isLoadingCheck = useAppSelector(selectAdminLoadingCheck);

  const [currentPage, setCurrentPage] = useState(1);
  const [updateUsers, setUpdateUsers] = useState<string[]>([]);

  const USERS_PER_PAGE = 50;

  useEffect(() => {
    dispatch(getAllUsers({}));
  }, [dispatch]);

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

      {users.length > 0 && (
        <>
          <UsersTable
            currentPage={currentPage}
            updateUsers={updateUsers}
            setUpdateUsers={setUpdateUsers}
          />

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
      <div className={styles.pagination}>
        {Array.from(
          { length: Math.ceil(users.length / USERS_PER_PAGE) },
          (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={cn(styles.pageButton, {
                [styles.active]: currentPage === i + 1,
              })}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
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
                      limit: 100,
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
