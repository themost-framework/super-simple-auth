import { AccessDeniedError, ApplicationService, DataError, DataNotFoundError } from '@themost/common';
import { User, UserCredential } from '../models';
import crypto from 'crypto';

class UnknownUserError extends DataError {
    constructor() {
        super('E_USER', 'Unknown user', null, 'User');
        this.statusCode = 401;
    }
}

class InvalidCredentialsError extends DataError {
    constructor() {
        super('E_CREDENTIALS', 'Invalid credentials', null, 'User');
        this.statusCode = 401;
    }
}

class InvalidUserStatusError extends AccessDeniedError {
    constructor() {
        super('Account is disabled', null);
        this.model = 'User';
        this.statusCode = 403;
    }
}

class Authenticator extends ApplicationService {
    constructor(app) {
        super(app);
    }

    /**
     * @param {DataContext} context
     * @param {string} username 
     * @param {string} password
     * @returns {import('./models').User}
     */
    async validateUser(context, username, password) {
        const user = await context.model(User).asQueryable().where((u) => {
            return u.name === username;
        }, {
            username
        }).silent().getTypedItem();
        if (user == null) {
            throw new UnknownUserError();
        }
        // validate password
        const valid = await context.model(UserCredential).asQueryable().where((u) => {
            return u.user.name === username && 
                (u.userPassword === clearText || u.userPassword === md5Text || u.userPassword === sha1Text);
        }, {
            username: username,
            clearText: `{clear}${password}`,
            md5Text: `{md5}${crypto.createHash('md5').update(password).digest('hex')}`,
            sha1Text: `{sha1}${crypto.createHash('sha1').update(password).digest('hex')}`
        }).silent().count();
        if (!valid) {
            throw new InvalidCredentialsError();
        }
        if (!user.enabled) {
            throw new InvalidUserStatusError();
        }
        return user;
    }
}

export {
    Authenticator,
    UnknownUserError,
    InvalidCredentialsError,
    InvalidUserStatusError
}