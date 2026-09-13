// Система аутентификации и ролей

class Auth {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('logorun_users')) || [];
    this.currentUser = JSON.parse(localStorage.getItem('logorun_currentUser')) || null;
    this.initDefaultUsers();
  }

  initDefaultUsers() {
    // Если нет пользователей, добавляем демо-пользователей
    if (this.users.length === 0) {
      this.users = [
        {
          id: 1,
          username: 'aleksei',
          password: 'pass123',
          role: 'client',
          createdAt: new Date(),
        },
        {
          id: 2,
          username: 'owner_shop',
          password: 'owner123',
          role: 'owner',
          createdAt: new Date(),
          shopName: 'Мой магазин',
        },
        {
          id: 3,
          username: 'admin',
          password: 'admin123',
          role: 'superadmin',
          createdAt: new Date(),
        },
      ];
      this.saveUsers();
    }
  }

  saveUsers() {
    localStorage.setItem('logorun_users', JSON.stringify(this.users));
  }

  login(username, password, role) {
    const user = this.users.find(
      u => u.username === username && u.password === password && u.role === role
    );

    if (!user) {
      return { success: false, message: 'Неправильное имя пользователя или пароль' };
    }

    // Создаём токен
    const token = btoa(JSON.stringify({ userId: user.id, username: user.username, role: user.role }));
    
    this.currentUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      token: token,
      shopName: user.shopName || null,
    };

    localStorage.setItem('logorun_currentUser', JSON.stringify(this.currentUser));
    return { success: true, user: this.currentUser };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('logorun_currentUser');
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  hasPermission(action) {
    if (!this.currentUser) return false;

    const permissions = {
      superadmin: ['create_post', 'edit_post', 'delete_post', 'create_product', 'edit_product', 'delete_product', 'manage_users', 'view_admin'],
      owner: ['create_product', 'edit_product', 'delete_product', 'view_stats'],
      client: ['create_post', 'edit_post', 'delete_post', 'add_to_cart', 'checkout'],
    };

    return permissions[this.currentUser.role]?.includes(action) || false;
  }

  register(username, password, role) {
    if (this.users.find(u => u.username === username)) {
      return { success: false, message: 'Пользователь уже существует' };
    }

    const newUser = {
      id: Math.max(...this.users.map(u => u.id), 0) + 1,
      username,
      password,
      role,
      createdAt: new Date(),
      shopName: role === 'owner' ? `Магазин ${username}` : null,
    };

    this.users.push(newUser);
    this.saveUsers();
    return { success: true, message: 'Регистрация успешна' };
  }
}

// Глобальный объект Auth
const auth = new Auth();
