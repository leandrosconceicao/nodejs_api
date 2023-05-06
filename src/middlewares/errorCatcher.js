function errorCatcher(err, req, res, next) {
    res.status(500).json(ApiResponse.dbError(err));
}

export default errorCatcher;