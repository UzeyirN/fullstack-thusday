const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config();
const app = express();
app.use(cors())
app.use(bodyParser.json())


const { Schema } = mongoose;
const productSchema = new Schema(
    {
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        brend: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }

)

mongoose.set('strictQuery', false);
const Products = mongoose.model("products", productSchema);

const PORT = process.env.PORT;
const DB = process.env.URL.replace("<password>", process.env.PASSWORD)
mongoose.connect(DB, (err) => {
    console.log(err);
    if (!err) {
        console.log("Connected");
        app.listen(PORT, () => {
            console.log(`Port:${PORT}`);
        })
    }
})


app.get("/products", (req, res) => {
    Products.find({}, (err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            res.status(500).json({ message: err })
        }
    })
})




app.get("/products/:id", (req, res) => {
    const { id } = req.params;
    Products.findById(id, (err, docs) => {
        if (!err) {
            if (docs) {
                res.send(docs)
                res.status(200)
            } else {
                res.status(404).json({ message: "Not Found" })
            }
        } else {
            res.status(500).json(
                { message: err }
            )
        }
    })
})

app.post("/products", async (req, res) => {
    const product = req.body
    try {
        await Products.create(product)
        res.status(200).json({
            message: "success"
        })
    } catch (error) {
        console.log(error);
    }
})

app.delete("/products/:id", (req, res) => {
    const { id } = req.params;
    Products.findByIdAndDelete(id, (err) => {
        if (!err) {
            res.send("Successfully DELETE")
        } else {
            res.status(500).json({
                message: err
            })
        }
    })
})

