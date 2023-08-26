
const YearlyExpense = require('../models/YearlyExpenses')
const AWS = require('aws-sdk')
const Expenses = require('../models/Expenses')
const User = require('../models/User')
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

exports.addExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body

        const id = req.user._id
        const newTotalExpense = Number(req.user.total_expense) + Number(amount);
        const newRemainingBalance = Number(req.user.total_income) - newTotalExpense;

        await User.findByIdAndUpdate(id, {
            total_expense: newTotalExpense,
            remaining_balance: newRemainingBalance
        });

        const expense = new Expenses({
            name: description,
            amount,
            category,
            userId: id
        });

        await expense.save();

        res.status(200).json('EXPENSE ADDED SUCCESSFULLY!')

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err })
    }
}

exports.getExpense = async (req, res) => {

    try {
        const id = req.user._id

        const userExpense = await Expenses.find({ userId: id })

        res.status(200).json({ userExpense, success: true })
    } catch (err) {
        res.status(500).json({ success: false, message: err })
    }
}

exports.updateExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body
        const userId = req.user._id
        const id = req.params.id
        const user = req.user
        const d = new Date();

        const expense = await Expenses.findOne({ _id: id })

        if (!expense) {
            throw new Error("Expense not found");
        }

        const month = new Date().toLocaleString('default', { month: 'long' });

        const getMonthData = await YearlyExpense.findOne({
            month: month,
            userId: userId
        });

        if (getMonthData) {
            const newExpense = Number(expense.amount);
            const updatedExpense = getMonthData.expense - newExpense;
            getMonthData.expense = updatedExpense + Number(amount);
            await getMonthData.save();
        } else {
            throw new Error("Monthly data not found");
        }


        const updateUserExpense = user.total_expense - Number(expense.amount)
        const updatedExpense = updateUserExpense + Number(amount)
        let updatedBalance;

        if (Number(expense.amount) > Number(amount)) {
            const diff = Number(expense.amount) - Number(amount)
            updatedBalance = Number(user.remaining_balance) + Number(diff)
        } else {

            const diff = Number(amount) - Number(expense.amount)
            updatedBalance = Number(user.remaining_balance) - diff

        }

        await User.findByIdAndUpdate(userId, {
            total_expense: updatedExpense,
            remaining_balance: updatedBalance
        })

        await Expenses.findByIdAndUpdate(id, {
            name: description,
            amount,
            category
        })

        res.status(200).json({ message: 'Update Successfull' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err })

    }
}

exports.deleteExpense = async (req, res) => {

    try {
        const id = req.params.id
        const userId = req.user._id
        const d = new Date();
        let month = d.toLocaleString('default', { month: 'long' });

        const exp = await Expenses.findOne({ _id: id })

        if (!exp) {
            throw new Error("Expense not found");
        }

        if (exp.userId == userId) {

            const getMonthData = await YearlyExpense.findOne({
                month: month,
                userId: userId
            })

            if (getMonthData) {
                getMonthData.expense -= exp.amount;
                await getMonthData.save();

            } else {
                throw new Error("YearlyExpense data not found for this month and user");
            }

            const updatedExpense = Number(req.user.total_expense) - Number(exp.amount)
            const updatedBalance = Number(req.user.remaining_balance) + Number(exp.amount)

            await User.findByIdAndUpdate(userId, {
                total_expense: updatedExpense,
                remaining_balance: updatedBalance
            })

            await Expenses.findByIdAndDelete(id)
            res.status(200).json({ message: 'Deleted Successfully' })

        } else {
            throw new Error('Only the user created this expense can delete this!')

        }

    } catch (err) {
        res.status(500).json({ success: false, message: 'SOMETHING WENT WRONG' })
    }
}

exports.getMontlyExpense = async (req, res) => {

    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const rowPerPage = parseInt(req.query.rowPerPage) || 10; // You can set a default value if needed
        const skip = (page - 1) * rowPerPage;
    
        const total_expense = await Expenses.countDocuments({ userId: userId });
    
        const expenses = await Expenses.find({ userId: userId })
            .skip(skip)
            .limit(rowPerPage)
            .exec();
    
        return res.status(200).json({ expense: expenses, lastPage: Math.ceil(total_expense / rowPerPage) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.addYearlyExpense = async (req, res) => {
    try {
        const user = req.user
        const data = req.body
        const d = new Date();
        let month = d.toLocaleString('default', { month: 'long' });;

        const getMonthData = await YearlyExpense.findOne({
            month: month,
            userId: user._id
        })

        if (getMonthData == null) {
            const yearlyData = new YearlyExpense({
                month: data.month,
                expense: data.expense,
                userId: user._id

            })
            await yearlyData.save()
        } else {
            getMonthData.expense = getMonthData.expense + data.expense
            await getMonthData.save()
        }

        res.status(200).json({ success: true, data: 'Added yearly expense' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err })

    }
}

exports.getYearlyExpense = async (req, res) => {
    try {
        const id = req.user._id
        const yearlyExpenses = await YearlyExpense.find({
            userId: id
        })

        res.status(200).json({ success: true, data: yearlyExpenses })

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err })
    }
}

const uploadToS3 = async (data, fileName) => {
    try {
        let s3bucket = new AWS.S3({
            accessKeyId: process.env.IAM_USER_ACCESSKEY,
            secretAccessKey: process.env.IAM_USER_SECRETKEY,
        })
        var params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: data,
            ACL: 'public-read'
        }
        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, res) => {
                if (err) {
                    console.log('Something went wrong', err)
                    reject(err)
                } else {
                    console.log('Success', res)
                    resolve(res.Location)

                }
            })
        })

    } catch (err) {
        console.log(err)
    }
}

exports.downloadExpense = async (req, res) => {
    try {
        const userId = req.user._id
        const expenses = await Expenses.find({
            userId: userId
        })

        const stringifyExpense = JSON.stringify(expenses)
        const fileName = `Expense${userId}/${new Date()}.txt`
        const fileUrl = await uploadToS3(stringifyExpense, fileName)
        res.status(200).json({ success: true, fileUrl })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, fileUrl: '', err: err })
    }
}
