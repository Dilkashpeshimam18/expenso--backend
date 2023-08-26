const User = require('../models/User')

exports.showLeaderboard = async (req, res) => {
   try {
      const leaderBoardData = await User.find({}, { id: 1, name: 1, total_expense: 1 })
         .sort({ total_expense: -1 })
         .exec();

      res.status(200).json({ success: true, data: leaderBoardData });
   } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, err: err.message });
   }
}