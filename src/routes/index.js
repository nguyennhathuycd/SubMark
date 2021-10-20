const homeRouter = require('./home')
const signinRouter = require('./sign_in')
const signupRouter = require('./sign_up')
const profileRouter = require('./profile')
const logoutRouter = require('./logout')
const classroomRouter = require('./classroom')
var User = require('../models/user')

function route(app){
    app.use('/sign_in', signinRouter)
    app.use('/sign_up', signupRouter)
    app.use('/classroom', classroomRouter)
    app.use('/profile', profileRouter)
    app.use('/logout', logoutRouter)
    app.use('/', homeRouter)
}

module.exports = route

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
