const AllUser = require("../model/AllUsers");
const bcrypt = require("bcrypt");

//We use async await with bcrypt
const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: "Username and password required" });

  //Check for duplicate in the db
  const duplicate = await AllUser.findOne({ username: user });
  if (duplicate) return res.sendStatus(409); //Conflict http status code (409)

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create new user
    const newUser = await AllUser.create({
      username: user,
      password: hashedPwd,
    });
    console.log(newUser);

    res.status(201).json({ message: `New user ${user} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
