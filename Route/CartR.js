const express = require("express");
const router = express.Router();

const Cart = require("../Schema/Cart");
const Product = require("../Schema/Product");
const Order = require("../Schema/Delivery");


router.post("/addtocart", async (req, res) => {
  try {
    const { phoneno, prodid } = req.body;

    if (!phoneno || !prodid) {
      return res.status(400).json({
        message: "Phone number and Product ID required",
      });
    }

    const alreadyExist = await Cart.findOne({
      phoneno,
      prodid,
    });

    if (alreadyExist) {
      return res.status(200).json({
        message: "Product already in cart",
      });
    }

    const cartItem = new Cart({
      phoneno,
      prodid,
    });

    await cartItem.save();

    res.status(201).json({
      message: "Product added to cart",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});








router.get("/getcartproducts/:phoneno", async (req, res) => {

    try {

        const phoneno = req.params.phoneno

        const cartItems =
            await Cart.find({ phoneno })

        const finalData = await Promise.all(

            cartItems.map(async(item)=>{

                const product =
                    await Product.findOne({
                        prodid: item.prodid
                    })

                return {

                    quantity: item.quantity,

                    product
                }
            })
        )

        res.status(200).json(finalData)

    } catch (error){

        res.status(500).json({
            error: error.message
        })
    }
});


router.put("/updatequantity", async (req, res) => {

    try {

        const {
            phoneno,
            prodid,
            quantity
        } = req.body

        if(quantity < 1){

            return res.status(400).json({
                message: "Quantity cannot be less than 1"
            })
        }

        await Cart.updateOne(
            {
                phoneno,
                prodid
            },
            {
                $set: {
                    quantity
                }
            }
        )

        res.status(200).json({
            success: true
        })

    } catch (error){

        res.status(500).json({
            error: error.message
        })
    }
});




router.delete(
    "/removeitem/:phoneno/:prodid",
    async (req, res) => {

        try {

            const {
                phoneno,
                prodid
            } = req.params

            await Cart.deleteOne({
                phoneno,
                prodid
            })

            res.status(200).json({
                success: true
            })

        } catch (error){

            res.status(500).json({
                error: error.message
            })
        }
});



router.post("/placeorder", async (req, res) => {

    try {

        const {

            phoneno,

            address,

            paymentMethod,

            items

        } = req.body


        // CHECK ITEMS
        if(!items || items.length === 0){

            return res.status(400).json({

                message: "No items found"
            })
        }


        let subtotal = 0

        const orderItems = []


        // LOOP ITEMS
        for(const item of items){

            const product =
                await Product.findOne({

                    prodid: item.prodid
                })


            if(product){

                const quantity =
                    item.quantity || 1


                const total =
                    product.Prodtprice *
                    quantity


                subtotal += total


                orderItems.push({

                    prodid: product.prodid,

                    name: product.Prodtname,

                    image: product.Productimg,

                    price: product.Prodtprice,

                    quantity: quantity,

                    total: total
                })
            }
        }


        const deliveryCharge = 40

        const handlingFee = 20

        const totalAmount =
            subtotal +
            deliveryCharge +
            handlingFee


        // DELIVERY DATE
        const deliveryDate =
            new Date()

        deliveryDate.setDate(
            deliveryDate.getDate() + 5
        )


        // SAVE ORDER
        const order =
            new Order({

                phoneno,

                address,

                items: orderItems,

                bill: {

                    subtotal,

                    deliveryCharge,

                    handlingFee,

                    totalAmount
                },

                paymentMethod,

                deliveryDate
            })


        await order.save()


        // REMOVE ORDERED ITEMS FROM CART
        for(const item of items){

            await Cart.deleteOne({

                phoneno,

                prodid: item.prodid
            })
        }


        res.status(201).json({

            success: true,

            message: "Order placed successfully",

            order
        })

    } catch (error){

        res.status(500).json({

            error: error.message
        })
    }
});



router.get(
    "/getorders/:phoneno",

    async (req, res) => {

        try {

            const phoneno =
                req.params.phoneno

            const orders =
                await Order.find({

                    phoneno
                })

                .sort({
                    createdAt: -1
                })

            res.status(200).json(
                orders
            )

        } catch (error){

            res.status(500).json({

                error: error.message
            })
        }
});


router.delete(
    "/cancelorder/:orderid",

    async (req, res) => {

        try {

            await Order.findByIdAndDelete(

                req.params.orderid
            )

            res.status(200).json({

                success: true
            })

        } catch (error){

            res.status(500).json({

                error: error.message
            })
        }
});

module.exports = router;