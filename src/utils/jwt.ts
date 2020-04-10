
import * as jwt from 'jsonwebtoken'

export  function JWTvalidate(token) {
    return jwt.verify(token, process.env.JWT_SECRET, {expiresIn: '90d'})
}

export function JWTsign(obj) {
     return jwt.sign({ _id: obj._id }, process.env.JWT_SECRET);
}