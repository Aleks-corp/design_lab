export const handlerSaveError = (error, data, next) => {
  error.code === 11000 && error.name === 'MongoServerError'
    ? (error.status = 409)
    : (error.status = 400);
  next();
};

export const handleUpdateValidator = function (next) {
  this.options.runValidators = true;
  next();
};
