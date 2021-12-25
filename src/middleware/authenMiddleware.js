module.exports = function(req, res, next) {
    if ( req.session._id || req.user) {
        next()
    } else {
        let errors = 'Your session has expired.';
        return res.render('sign_in' ,{errors:errors, style: 'main.css', notLoggin: true})
    }
}