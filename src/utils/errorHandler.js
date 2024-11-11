module.exports = (err, req, res, next) => {
    console.error('Error stack:', err.stack);
    
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            status: statusCode,
        }
    });
};
