const express = require('express');
const cors = require('cors');
require("dotenv").config();
const connectDB = require('./config/mongo');
const productdetail = require('./Route/ProductR');
const category = require('./Route/CategoryR');
const Cart = require('./Route/CartR');




const bodyParser = require('body-parser');
const app = express();
const path = require('path');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
connectDB();



app.use('/productimage', express.static(path.join(__dirname, 'productimage')));
app.use('/productdetails', productdetail);
app.use("/Categoryimage", express.static(path.join(__dirname, "Categoryimage")));
app.use('/category', category);
app.use('/cart', Cart);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));