const homeRouter = require('./home')
const signinRouter = require('./sign_in')
const signupRouter = require('./sign_up')
const profileRouter = require('./profile')
const logoutRouter = require('./logout')
const classroomRouter = require('./classroom')
const authGoogleRouter = require('./authGoogle')
const atuthenMiddleware = require('../middleware/authenMiddleware')
require('../services/passport');

function route(app){
    app.use('/sign_in', signinRouter)
    app.use('/sign_up', signupRouter)
    // Auth Routes
    app.use('/authGoogle', authGoogleRouter)
    app.use('/', homeRouter)
    //Check user had login or not
    app.use(atuthenMiddleware)
    app.use('/classroom', classroomRouter)
    app.use('/profile', profileRouter)
    app.use('/logout', logoutRouter)
}

module.exports = route