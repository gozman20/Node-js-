const mongoose=require('mongoose')
const EmployeesSchema = mongoose.Schema(
    {
      firstname: {
        type: String,
        required: [true, 'Please add a name'],
      },
      lastname: {
        type: String,
        required: [true, 'Please add an email'],
        
      },
      
    },
    {
      timestamps: true,
    }
  )
  
  module.exports = mongoose.model('Employees', EmployeesSchema)