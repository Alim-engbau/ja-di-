const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ======================================
// MONGODB CONNECT
// ======================================
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/jadi-sushi";

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB подключена");
  })
  .catch((err) => {
    console.log("Ошибка подключения MongoDB:", err);
  });

// ======================================
// PRODUCT SCHEMA
// ======================================
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

// ======================================
// CATEGORY SCHEMA
// ======================================
const CategorySchema = new mongoose.Schema({
  name: String,
  key: String,
  image: String
});

const Category = mongoose.model("Category", CategorySchema);

// ======================================
// ORDER SCHEMA
// ======================================
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

// ======================================
// HOME
// ======================================
app.get("/", (req, res) => {
  res.json({
    message: "Суши ja di API работает",
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

// ======================================
// GET PRODUCTS
// ======================================
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

// ======================================
// GET PRODUCTS BY CATEGORY
// ======================================
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

// ======================================
// ADD PRODUCT
// ======================================
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

// ======================================
// DELETE PRODUCT
// ======================================
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

// ======================================
// GET CATEGORIES
// ======================================
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

// ======================================
// ADD CATEGORY
// ======================================
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

// ======================================
// CREATE ORDER
// ======================================
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

// ======================================
// GET ORDERS
// ======================================
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

// ======================================
// UPDATE ORDER STATUS
// ======================================
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

// ======================================
// DELETE ORDER
// ======================================
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



// ======================================
// SEED DEMO DATA (open once after deploy)
// ======================================
app.get("/seed-demo-2026", async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();
    const categoriesCount = await Category.countDocuments();

    if (productsCount > 0 || categoriesCount > 0) {
      return res.json({
        message: "Данные уже есть в базе. Seed не выполнен.",
        productsCount,
        categoriesCount
      });
    }

    await Category.insertMany([
    {
      name: "Роллы",
      key: "rolls",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1200"
    },
    {
      name: "Фастфуд",
      key: "fastfood",
      image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1200"
    },
    {
      name: "Пицца",
      key: "pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200"
    },
    {
      name: "Напитки",
      key: "drinks",
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1200"
    }
  
    ]);

    await Product.insertMany([
    {
      name: "Филадельфия",
      category: "rolls",
      description: "Лосось, сливочный сыр, рис, нори, огурец.",
      price: 2600,
      img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1200"
    },
    {
      name: "Калифорния",
      category: "rolls",
      description: "Краб, огурец, рис, нори, икра масаго.",
      price: 2300,
      img: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=1200"
    },
    {
      name: "Запечённый ролл",
      category: "rolls",
      description: "Рис, нори, сырный соус, курица, огурец.",
      price: 2400,
      img: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1200"
    },
    {
      name: "Темпура ролл",
      category: "rolls",
      description: "Горячий ролл в хрустящей панировке с соусом.",
      price: 2500,
      img: "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?q=80&w=1200"
    },

    {
      name: "Картофель фри",
      category: "fastfood",
      description: "Картофель фри с солью и соусом на выбор.",
      price: 900,
      img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1200"
    },
    {
      name: "Наггетсы",
      category: "fastfood",
      description: "Куриные наггетсы в хрустящей панировке.",
      price: 1300,
      img: "https://images.unsplash.com/photo-1562967916-eb82221dfb36?q=80&w=1200"
    },
    {
      name: "Чизбургер",
      category: "fastfood",
      description: "Булочка, котлета, сыр, салат, соус.",
      price: 1800,
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200"
    },
    {
      name: "Куриный бургер",
      category: "fastfood",
      description: "Куриная котлета, овощи, сыр и фирменный соус.",
      price: 1900,
      img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=1200"
    },

    {
      name: "Пепперони",
      category: "pizza",
      description: "Тесто, томатный соус, сыр моцарелла, пепперони.",
      price: 3200,
      img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1200"
    },
    {
      name: "Маргарита",
      category: "pizza",
      description: "Тесто, томатный соус, сыр моцарелла, томаты.",
      price: 2800,
      img: "https://images.unsplash.com/photo-1598023696416-0193a0bcd302?q=80&w=1200"
    },
    {
      name: "Четыре сыра",
      category: "pizza",
      description: "Сыр моцарелла, дорблю, пармезан и чеддер.",
      price: 3500,
      img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1200"
    },
    {
      name: "Куриная пицца",
      category: "pizza",
      description: "Курица, сыр, томатный соус, грибы и специи.",
      price: 3300,
      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200"
    },

    {
      name: "Coca-Cola 0.5",
      category: "drinks",
      description: "Газированный напиток Coca-Cola, 0.5 л.",
      price: 600,
      img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1200"
    },
    {
      name: "Sprite 0.5",
      category: "drinks",
      description: "Газированный напиток Sprite, 0.5 л.",
      price: 600,
      img: "https://images.unsplash.com/photo-1680404005217-a441afdefe83?q=80&w=1200"
    },
    {
      name: "Морс",
      category: "drinks",
      description: "Освежающий ягодный морс собственного приготовления.",
      price: 700,
      img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200"
    },
    {
      name: "Сок",
      category: "drinks",
      description: "Фруктовый сок в ассортименте.",
      price: 650,
      img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1200"
    }
  
    ]);

    res.json({
      message: "Демо-данные добавлены: 4 категории и 16 товаров",
      openSite: "/",
      openAdmin: "/admin.html"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================
// SERVER START
// ======================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SERVER START http://localhost:${PORT}`);
});
