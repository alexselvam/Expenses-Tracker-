const mongoose = require('mongoose');
const { Schema } = mongoose;
const { collection_prefix } = require("../config/geosbonosdm");

const IncomeSchema = new Schema(
    {
        source: { type: String, trim: true },
        amount: { type: Number, trim: true },
        paymentType: { type: String, trim: true },
        description: { type: String, trim: true },
        date: { type: Date, trim: true },

    },
    { _id: true }
);

const ExpensesSchema = new Schema(
    {
        source: { type: String, trim: true },
        amount: { type: Number, trim: true },
        paymentType: { type: String, trim: true },
        description: { type: String, trim: true },
        date: { type: Date, trim: true },

    },
    { _id: true }
);

const userSchema = new Schema(
    {
        name: { type: String, trim: true, default: "", },
        surname: { type: String, trim: true, default: "", },
        username: { type: String, trim: true, default: "", },
        email: { type: String, trim: true, lowercase: true, unique: true, default: "", },
        password: { type: String, required: true, },
        income: { type: [IncomeSchema] },
        expenses: { type: [ExpensesSchema] },
        status: { type: Boolean, default: true, },

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model('users', userSchema, collection_prefix + 'liarsuesestd')