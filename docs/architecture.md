# 🏗️ Архитектура Logorun

## 📊 Диаграмма системы

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (UI)                        │
├─────────────────────────────────────────────────────────┤
│  index.html (App)  │  admin.html (Admin Panel)          │
│  app.js            │  admin.js                           │
│  style.css         │  admin-styles.css                  │
└──────────────┬──────────────────────────────────────────┘
               │
        ┌──────▼──────┐
        │  Local Store │
        │  (Client)    │
        └──────┬──────┘
               │
        ┌──────▼────────────────────┐
        │   localStorage (Browser)   │
        │  - users                   │
        │  - posts                   │
        │  - products                │
        │  - cart                    │
        │  - orders                  │
        └──────────────────────────┘
```

## 🏛️ Слой-слойная архитектура

### 1. Presentation Layer (Презентационный слой)
```javascript
- HTML5 структура
- CSS3 стили (Grid, Flexbox)
- Vanilla JavaScript UI
- Responsive design
```

**Компоненты:**
- Login Form
- Feed (Лента)
- Product Grid
- Shopping Cart
- Admin Dashboard
- Site Builder

### 2. Business Logic Layer (Бизнес-логика)
```javascript
class Logorun {
  - createPost()
  - createProduct()
  - addToCart()
  - checkout()
  - likePost()
}

class Auth {
  - login()
  - logout()
  - hasPermission()
  - register()
}
```

### 3. Data Layer (Слой данных)
```javascript
localStorage API
- logorun_users
- logorun_posts
- logorun_products
- logorun_cart
- logorun_orders
- logorun_currentUser
```

---

## 🔐 Система аутентификации

```
┌─────────────────┐
│  User Inputs    │
│  Credentials    │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Auth.js   │
    │ Validates │
    └────┬─────┘
         │
    ┌────▼──────────────┐
    │  localStorage      │
    │  Stores token     │
    │  + user data      │
    └────┬──────────────┘
         │
    ┌────▼─────────┐
    │ Permissions   │
    │  Check        │
    └────┬──────────┘
         │
    ┌────▼─────────┐
    │ Grant Access  │
    │ to Features   │
    └───────────────┘
```

### Роли и привилегии

```javascript
const PERMISSIONS = {
  superadmin: [
    'create_post', 'edit_post', 'delete_post',
    'create_product', 'edit_product', 'delete_product',
    'manage_users', 'view_admin', 'view_analytics'
  ],
  owner: [
    'create_product', 'edit_product', 'delete_product',
    'view_stats', 'manage_shop'
  ],
  client: [
    'create_post', 'edit_post', 'delete_post',
    'add_to_cart', 'checkout', 'view_products'
  ]
}
```

---

## 📦 Структура данных

### User Object
```javascript
{
  id: Number,
  username: String,
  password: String,      // ⚠️ Hashed in production
  role: 'client' | 'owner' | 'superadmin',
  shopName: String,      // для владельцев
  createdAt: Date,
  token: String          // JWT in production
}
```

### Post Object
```javascript
{
  id: Number,
  author: String,
  authorId: Number,
  imageUrl: String,
  caption: String,
  category: String,
  likes: Number,
  createdAt: Date
}
```

### Product Object
```javascript
{
  id: Number,
  author: String,
  authorId: Number,
  imageUrl: String,
  title: String,
  price: Number,
  category: String,
  createdAt: Date
}
```

### Order Object
```javascript
{
  id: Number,
  userId: Number,
  items: [Product],
  total: Number,
  createdAt: Date,
  status: 'pending' | 'completed' | 'cancelled'
}
```

---

## 🔄 Потоки данных

### Создание поста
```
User Input (Form)
  ↓
Validation
  ↓
Create Post Object
  ↓
Add to state.posts
  ↓
Save to localStorage
  ↓
Re-render Feed
  ↓
Display to Users
```

### Оформление заказа
```
Items in Cart
  ↓
Click Checkout
  ↓
Create Order
  ↓
Save Order to state
  ↓
Clear Cart
  ↓
Update Owner Stats
  ↓
Show Confirmation
```

---

## 🎨 UI/UX Архитектура

### Компоненты (Components)
```
App
├── Navbar
├── LoginForm
├── MainContent
│   ├── Tabs
│   │   ├── Feed
│   │   ├── Products
│   │   ├── Cart
│   │   └── OwnerDashboard
│   ├── PostForm
│   ├── ProductForm
│   ├── Cards
│   └── Cart Display
└── Footer
```

### Admin Components
```
AdminPanel
├── AdminNavbar
├── AdminSidebar
│   ├── Dashboard
│   ├── Users
│   ├── Posts
│   ├── Products
│   ├── Orders
│   ├── Settings
│   └── SiteBuilder
├── AdminContent
└── AdminModal
```

---

## 🚀 Future Architecture (Production)

```
┌──────────────────────────────────────────────────────┐
│              Frontend (React/Vue)                     │
├──────────────────────────────────────────────────────┤
│  - Components                                         │
│  - State Management (Redux/Vuex)                     │
│  - Routing (React Router)                            │
└────────────────────┬─────────────────────────────────┘
                     │ REST/GraphQL API
┌────────────────────▼─────────────────────────────────┐
│         Backend (Node.js/Express)                    │
├──────────────────────────────────────────────────────┤
│  Routes │ Controllers │ Middleware │ Validators       │
└────────────────────┬─────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼────┐  ┌───▼────┐  ┌───▼─────┐
    │Database│  │ Cache  │  │   CDN   │
    │PostgreSQL  │ Redis │  │ CloudFront
    └────────┘  └────────┘  └─────────┘
```

---

## 🔒 Безопасность

### Текущее состояние (НЕБЕЗОПАСНО)
```javascript
// ❌ Пароли в открытом виде
password: 'pass123'

// ❌ Токены в localStorage
localStorage.setItem('token', token)
```

### Production-ready
```javascript
// ✅ Хешированные пароли
password: bcrypt.hash('pass123', 10)

// ✅ HttpOnly cookies
res.cookie('token', token, { httpOnly: true })

// ✅ JWT verification
jwt.verify(token, SECRET_KEY)

// ✅ CORS настройки
app.use(cors({ origin: ALLOWED_ORIGINS }))
```

---

## 📊 Масштабируемость

### Текущий уровень
- Single-page application
- Client-side storage
- No server
- Max ~10MB data

### Масштабируемая система
- Multiple servers
- Database (PostgreSQL)
- Cache layer (Redis)
- CDN (CloudFront, Cloudinary)
- Microservices

---

## 🔧 DevOps

### Deployment
```
GitHub ──► CI/CD ──► Staging ──► Production
              ↓
        (Tests, Build)
```

### Infrastructure
```
Load Balancer
  ├── Server 1
  ├── Server 2
  └── Server 3
      └── Database
      └── Cache
      └── CDN
```

---

**Версия:** 1.0 | **Дата:** 13.09.2026
