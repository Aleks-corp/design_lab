const upd = () => {
  const user = {
    substart: null,
    subend: null,
  };

  const date = new Date().getTime();

  user.substart = date;
  user.subend = new Date(
    new Date(date).setMonth(new Date(date).getMonth() + 1)
  ).getTime();
  console.log("user:", new Date(user.substart), new Date(user.subend));
  return user;
};
