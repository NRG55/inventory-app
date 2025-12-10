const setCurrentPathToLocals = (req, res, next) => {
    res.locals.path = req.path;
    next();
};

module.exports = setCurrentPathToLocals;