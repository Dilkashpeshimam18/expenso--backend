// const sgMail = require('@sendgrid/mail');
// const uuid = require('uuid');
// const Users = require('../models/users');
// const ForgotPasswordRequests = require('../models/forgotpassword');
// const bcrypt = require('bcrypt');

// exports.forgotPassword = async (req, res) => {
//     sgMail.setApiKey(process.env.SENDGRID_APIKEY);

//     try {

//         const { email } = req.body
//         const user = await Users.findOne({ where: { email: email } })


//         if (user) {
//             const id = uuid.v4()


//             await ForgotPasswordRequests.create({ id, userId: user.id, isactive: true }).catch((err) => {
//                 throw new Error(err)
//             })
//             let link = `http://localhost:4000/password/resetpassword/${id}`
//             const msg = {
//                 to: email,
//                 from: 'dilkashpeshimam@gmail.com',
//                 subject: 'Reset Password!',
//                 text: `Hi, \n 
//                 Please click on the following link ${link} to reset your password. \n\n 
//                 If you did not request this, please ignore this email and your password will remain unchanged.\n`,
//             };


//             sgMail
//                 .send(msg)
//                 .then((response) => {

//                     return res.status(response[0].statusCode).json({ message: 'Link to reset password sent to your email ', sucess: true })

//                 })
//                 .catch((error) => {
//                     console.log(error)
//                     throw new Error(error);
//                 })


//         } else {
//             throw new Error('User doesnt exist!')
//         }


//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ err })
//     }

// }

// exports.resetPassword = async (req, res) => {
//     try {
//         const requestId = req.params.id
//         const resetRequest = await ForgotPasswordRequests.findOne({ where: { id: requestId } })
//         if (resetRequest) {
//             if (resetRequest.isactive == 1) {
//                 ForgotPasswordRequests.update({ isactive: false })
//                 res.status(200).send(`<html>
//             <script>
//                 function formsubmitted(e){
//                     e.preventDefault();
//                     console.log('called')
//                 }
//             </script>
//             <form action="/password/updatepassword/${requestId}" method="get">
//                 <label for="newpassword">Enter New password</label>
//                 <input name="newpassword" type="password" required></input>
//                 <button>reset password</button>
//             </form>
//         </html>`
//                 )
//                 res.end()
//             }
//         }

//     } catch (err) {
//         console.log(err)
//         return res.status(403).json({ err, success: false })

//     }

// }


// exports.updatepassword = async (req, res) => {

//     try {
//         const { newpassword } = req.query;
//         const { resetpasswordid } = req.params;
//         const response = await ForgotPasswordRequests.findOne({ where: { id: resetpasswordid } })
//         const user = await Users.findOne({ where: { id: response.userId } })
//         if (user) {
//             const saltRounds = 10;
//             bcrypt.genSalt(saltRounds, function (err, salt) {
//                 if (err) {
//                     console.log(err);
//                     throw new Error(err);
//                 }
//                 bcrypt.hash(newpassword, salt, async function (err, hash) {
//                     if (err) {
//                         console.log(err);
//                         throw new Error(err);
//                     }
//                     await user.update({ password: hash })
//                     res.status(200).json({ success: true, user: 'Successfully updated password!' })

//                 });
//             });
//         } else {
//             return res.status(404).json({ error: 'No user Exists', success: false })
//         }

//     } catch (error) {
//         return res.status(403).json({ error, success: false })
//     }

// }