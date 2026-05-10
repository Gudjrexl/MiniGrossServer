// Schema/Order.js

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(

    {

         orderid: {

            type: String,

            unique: true
        },

        phoneno: {
            type: String,
            required: true
        },

        address: {

            name: String,

            phone: String,

            houseno: String,

            area: String,

            state: String,

            country: {
                type: String,
                default: "India"
            },

            pincode: String
        },

        items: [

            {

                prodid: Number,

                name: String,

                image: String,

                price: Number,

                quantity: Number,

                total: Number
            }
        ],

        bill: {

            subtotal: Number,

            deliveryCharge: Number,

            handlingFee: Number,

            totalAmount: Number
        },

        paymentMethod: {

            type: String,

            enum: [
                "COD",
                "ONLINE"
            ],

            default: "COD"
        },

        orderStatus: {

            type: String,

            default: "Placed"
        },

        deliveryDate: {

            type: Date
        }

    },

    {
        timestamps: true
    }
);


OrderSchema.pre("save", function(next){

    if(!this.orderid){

        const random =
            Math.floor(
                100000 + Math.random() * 900000
            )

        this.orderid =
            `ORD${Date.now()}${random}`
    }

    next()
})

module.exports =
    mongoose.model(
        "Order",
        OrderSchema
    );