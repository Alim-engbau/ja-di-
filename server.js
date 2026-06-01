const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/jadi-sushi";

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB подключена");
  })
  .catch((err) => {
    console.log("Ошибка подключения MongoDB:", err);
  });

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    default: ""
  }
});

const Product = mongoose.model("Product", ProductSchema);

const CategorySchema = new mongoose.Schema({
  name: String,
  key: String,
  image: String
});

const Category = mongoose.model("Category", CategorySchema);

const OrderSchema = new mongoose.Schema({
  customer: {
    name: String,
    phone: String,
    address: String
  },
  items: [
    {
      productId: String,
      name: String,
      category: String,
      price: Number,
      quantity: Number
    }
  ],
  total: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: "Новый"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", OrderSchema);

app.get("/", (req, res) => {
  res.json({
    message: "JA DI API работает",
    endpoints: [
      "GET /categories",
      "GET /products",
      "POST /products",
      "DELETE /products/:id",
      "GET /orders",
      "POST /orders",
      "PATCH /orders/:id/status",
      "DELETE /orders/:id"
    ]
  });
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/products/category/:category", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category
    }).sort({ name: 1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, category, description, price, img } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        error: "Название, категория и цена обязательны"
      });
    }

    const product = new Product({
      name,
      category,
      description,
      price: Number(price),
      img
    });

    await product.save();

    res.json({
      message: "Товар добавлен",
      product
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        error: "Товар не найден"
      });
    }

    res.json({
      message: "Товар удалён"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.post("/categories", async (req, res) => {
  try {
    const { name, key, image } = req.body;

    const category = new Category({
      name,
      key,
      image
    });

    await category.save();

    res.json({
      message: "Категория добавлена",
      category
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({
        error: "Данные клиента заполнены не полностью"
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Корзина пустая"
      });
    }

    const total = items.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    const order = new Order({
      customer,
      items,
      total,
      status: "Новый"
    });

    await order.save();

    res.json({
      message: "Заказ сохранён",
      order
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        error: "Заказ не найден"
      });
    }

    res.json({
      message: "Статус заказа обновлён",
      order
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.delete("/orders/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        error: "Заказ не найден"
      });
    }

    res.json({
      message: "Заказ удалён"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SERVER START http://localhost:${PORT}`);
});
