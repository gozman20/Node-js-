

const AllUser=require('../model/AllUsers')
const bcrypt=require('bcrypt');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser =await AllUser.findOne({refreshToken})
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    
    foundUser.refreshToken='';

    //Not really necessary
    const result=await foundUser.save();
    console.log(result)

    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true
 }); //Uncomment secure and samsite in production mode
    res.sendStatus(204);
}

module.exports = { handleLogout }