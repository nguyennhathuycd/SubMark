const classesRouter = require('./classes')
const homeRouter = require('./home')
const signinRouter = require('./sign_in')
const signupRouter = require('./sign_up')
const profileRouter = require('./profile')
const logoutRouter = require('./logout')
var User = require('../models/user')

function route(app){
    // app.use(function(req, res, next) {
    //     User.findById(req.session.userId)
    //         .exec(function (error, user) {
    //             if (user === null) {
    //                 let isAuthenticated = false;
    //                 return res.render('sign_in', {errors:errors})
    //             } else {
    //                 res.render('profile', {
    //                 user: mongooseToObject(user)
    //                 })
    //             }   
    //         });
    //     res.locals.isAuthenticated = req.isAuthenticated();
    //     next();
    // });
    app.use('/classes', classesRouter)
    app.use('/sign_in', signinRouter)
    app.use('/sign_up', signupRouter)
    app.use('/profile', profileRouter)
    app.use('/logout', logoutRouter)
    app.use('/', homeRouter)
}

module.exports = route
