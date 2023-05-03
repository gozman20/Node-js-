const mongoose=require('mongoose')

const usersSchema = mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, 'Please add a name'],
      },
    
      password: {
        type: String,
        required: [true, 'Please add a password'],
      },
      refreshToken:{
        type: String
    },
    },
   
    {
      timestamps: true,
    }
  )
  
  module.exports = mongoose.model('AllUser', usersSchema)