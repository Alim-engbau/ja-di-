# Проверка через Postman

Базовый адрес сервера:
http://localhost:3000

## 1. Проверить сервер
GET http://localhost:3000/

## 2. Получить все категории
GET http://localhost:3000/categories

## 3. Получить все товары
GET http://localhost:3000/products

## 4. Получить товары категории роллов
GET http://localhost:3000/products/category/rolls

## 5. Добавить товар
POST http://localhost:3000/products
Content-Type: application/json

{
  "name": "Тестовый ролл",
  "category": "rolls",
  "description": "Рис, нори, сыр, огурец",
  "price": 2000,
  "img": "https://placehold.co/600x400?text=Test"
}

## 6. Создать заказ
POST http://localhost:3000/orders
Content-Type: application/json

{
  "customer": {
    "name": "Алим",
    "phone": "+77000000000",
    "address": "Караганда"
  },
  "items": [
    {
      "productId": "test-id",
      "name": "Филадельфия",
      "category": "rolls",
      "price": 2600,
      "quantity": 1
    },
    {
      "productId": "test-id-2",
      "name": "Coca-Cola 0.5",
      "category": "drinks",
      "price": 600,
      "quantity": 2
    }
  ]
}

## 7. Посмотреть заказы
GET http://localhost:3000/orders
