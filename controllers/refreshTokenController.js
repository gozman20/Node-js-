
const AllUser=require('../model/AllUsers')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')

const handleRefreshToken = async(req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
//check if refresh token is in db
    const foundUser =await AllUser.findOne({refreshToken})
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            // const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    // "UserInfo": {
                        "username": decoded.username
                        // "roles": roles
                    // }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports =  {handleRefreshToken }