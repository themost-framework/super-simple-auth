import express from 'express';
import {Strategy as LocalStrategy} from 'passport-local';
import { Authenticator } from '../services/Authenticator';

/**
 * @param {passport.PassportStatic} passport
 */
function authRouter(passport) {
    // local strategy example
    passport.use(new LocalStrategy({
            session: false,
            passReqToCallback: true
        },
        function(req, username, password, done) {
            const authenticator = req.context.application.getService(Authenticator);
            return authenticator.validateUser(req.context, username, password).then(user => {
                    return done(null, user);
                }).catch( err => {
                    return done(err);
                });
        }
    ));
    passport.serializeUser(function(user, done){
        done(null, user);
    });

    passport.deserializeUser(function(user, done){
        done(null, user);
    });
    let router = express.Router();

    router.use(passport.initialize());

    router.use(passport.session());

    router.use((req, res, next) => {
        if (typeof req.user === 'undefined') {
            req.user = {
                name: 'anonymous'
            };
        }
        return next();
    });

    router.get('/login', (req, res) => {
        if (req.user && req.user.name !== 'anonymous') {
            res.redirect('/');
        }
        res.render('login');
    });

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    router.post('/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        });
    return router;
}

module.exports = authRouter;
