const {AppError} = require('./utils');

const validateSchema = (schema, reqKey) => {
    return (req, res, next) => {
        const {error} = schema.validate(req[reqKey]);
        if(error) {
            const exception = new AppError(400, error.message, 'Bad Request');
            next(exception);
        }
        next();
    }
}

module.exports = {validateSchema};