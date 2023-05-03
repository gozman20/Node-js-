
const AllUser=require('../model/AllUsers')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv').config();




const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    const foundUser = await AllUser.findOne({username:user})
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '10m' }
        );
        // Saving refreshToken with current user
       foundUser.refreshToken=refreshToken;
       const result=await foundUser.save();
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None',
        maxAge:  10 * 1000 });//dont add secure: true in development mode
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };