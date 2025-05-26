import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../modals/user.modal.ts";
import Transaction from "../modals/transection.modal.ts";
import auth from "../middleware/auth.ts";

const emi = {
  userId: "68342a684e23b96223eab7b3", // Reference to the user
  loanId: "6501bcd9876543210def5678", // Reference to the main loan
  principalAmount: 50000, // Original loan amount
  interestRate: 0.05, // Monthly interest rate (5%)
  tenureMonths: 12, // Total number of EMIs
  startDate: "2024-01-01", // EMI start date
  dueDay: 5, // EMI is due on the 5th of every month
  emiAmount: 4298.44, // Fixed monthly installment calculated
};

router.use(auth);

router.post("/", async (req, res) => {
  try {
    const { type, amount } = req.body;
    const userId = req?.user.id; // From auth middleware
    console.log("User ID:", userId);

    // Validate transaction type
    if (
      ![
        "deposit",
        "withdrawal",
        "loan",
        "repayment",
        "share_purchase",
      ].includes(type)
    ) {
      res.status(400).json({ message: "Invalid transaction type" });
      return;
    }

    // Validate amount
    if (!amount || amount <= 0) {
      res.status(400).json({ message: "Invalid amount" });
      return;
    }

    const transaction = new Transaction({
      userId,
      type,
      amount,
      date: new Date(),
    });

    await transaction.save();
    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    console.error("Error in transection route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/statement", async (req, res) => {
  try {
    const userId = req?.user.id;

    // const statement = User.aggregate([
    //   {
    //     $lookup: {
    //       from: "transectio",
    //       localField: "_id",
    //       foreignField: "userId",
    //       as: "statement",
    //     },
    //   },
    //   { $addFields: { count: { $size: "$statement" } } },
    // ])
  const statement =  await Transaction.aggregate([
      {
        $match: { userId },
      },
      {
        $group: {
          _id: "$userId",
          totalDeposits: {
            $sum: {
              $cond: [{ $eq: ["$type", "Deposit"] }, "$amount", 0],
            },
          },
          totalWithdrawals: {
            $sum: {
              $cond: [{ $eq: ["$type", "Withdrawal"] }, "$amount", 0],
            },
          },
          totalLoanTaken: {
            $sum: {
              $cond: [{ $eq: ["$type", "Loan"] }, "$amount", 0],
            },
          },
          totalRepaid: {
            $sum: {
              $cond: [{ $eq: ["$type", "Repayment"] }, "$amount", 0],
            },
          },
          totalShares: {
            $sum: {
              $cond: [{ $eq: ["$type", "Share Purchase"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    console.log("statement", statement);
    res.status(200).json({
      message: "Transaction statement retrieved successfully",
      statement,
    });
  } catch (error) {
    console.error("Error in transection route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
