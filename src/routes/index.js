const homeRouter = require('./home')
const signinRouter = require('./sign_in')
const signupRouter = require('./sign_up')
const profileRouter = require('./profile')
const logoutRouter = require('./logout')
const classroomRouter = require('./classroom')
const authGoogleRouter = require('./authGoogle')
const atuthenMiddleware = require('../middleware/authenMiddleware')
const assignmentRouter = require('./assignment')
const markRouter = require('./mark')
const submitRouter = require('./submit')
const testRouter = require('./test')
require('../services/passport');

function route(app){
    app.use('/test', testRouter)
    app.use('/sign_in', signinRouter)
    app.use('/sign_up', signupRouter)
    // // Auth Routes
    app.use('/authGoogle', authGoogleRouter)
    app.use('/', homeRouter)
    //Check user had login or not
    app.use(atuthenMiddleware)
    app.use('/classroom', classroomRouter)
    app.use('/assignment', assignmentRouter)
    app.use('/profile', profileRouter)
    app.use('/mark', markRouter)
    app.use('/submit', submitRouter)
    app.use('/logout', logoutRouter)
}

module.exports = route