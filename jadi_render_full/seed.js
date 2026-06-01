const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/jadi-sushi";

mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB подключена"))
  .catch((err) => console.log("Ошибка подключения MongoDB:", err));

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  img: String
});

const CategorySchema = new mongoose.Schema({
  name: String,
  key: String,
  image: String
});

const Product = mongoose.model("Product", ProductSchema);
const Category = mongoose.model("Category", CategorySchema);

async function seed() {
  await Product.deleteMany({});
  await Category.deleteMany({});

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

  console.log("Добавлены 4 категории и 16 товаров");
  process.exit();
}

seed();
