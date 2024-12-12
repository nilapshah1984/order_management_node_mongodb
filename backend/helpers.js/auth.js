import bcrypt from 'bcrypt';

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        if (typeof password !== 'string') {
            return reject(new Error('Password must be a string'));
        }

        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

export const comparePassword = (password, hashed) => {
    return new Promise((resolve, reject) => {
        if (typeof password !== 'string' || typeof hashed !== 'string') {
            return reject(new Error('Password and hash must be strings'));
        }

        bcrypt.compare(password, hashed, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};
