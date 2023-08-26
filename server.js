const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth')
const expenseRoutes = require('./routes/expense')
const purchasePremiumRoutes = require('./routes/purchase')
const premiumRoutes = require('./routes/premium')
const passwordRoutes = require('./routes/password')
const userRoutes=require('./routes/user')
const incomeRoutes = require('./routes/income')
// const helmet = require('helmet')
// const morgan = require('morgan')
const fs = require('fs')
const mongoose=require('mongoose')
const path = require('path')

const app = express()
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
//     flags: 'a'
// })
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
// app.use(helmet())

// app.use(morgan('combined', { stream: accessLogStream }))
dotenv.config()

mongoose.connect(
    process.env.DB_CONNECT,
    {useUnifiedTopology:true,useNewUrlParser:true},
).then(() => console.log('Connected to db successfully'))
.catch((err) => { console.error(err); });

app.use('/auth', authRoutes)
app.use('/expense', expenseRoutes)
app.use('/purchase', purchasePremiumRoutes)
app.use('/premium', premiumRoutes)
// app.use('/password', passwordRoutes)
app.use('/income', incomeRoutes)
app.use('/user',userRoutes)

app.use(express.static(path.join(__dirname, "..", "/client/build")));
app.use(express.static(path.join(__dirname,"..", "/client/public")));


app.listen(4000, () => {
    console.log('SERVER RUNNING!!')
})
