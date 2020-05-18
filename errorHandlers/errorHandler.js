// module.exports = errorHandler = (err, req, res, next) => {
//     if (err.name === 'ValidationError') {
//         let valErrors = [];
//         Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
//         res.status(422).send(valErrors);
//     }
// }
//
//
//
