import { Injectable } from '@angular/core';

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USERS_KEY = 'aromic_users';
  private readonly CURRENT_USER_KEY = 'aromic_current_user';
  private users: User[] = [];

  constructor() {
    this.initializeDefaultAdmin();
    this.loadUsers();
  }

  // Initialize default admin account
  private initializeDefaultAdmin() {
    const existingUsers = localStorage.getItem(this.USERS_KEY);

    if (!existingUsers) {
      const defaultAdmin: User = {
        id: 1,
        email: 'admin@aromic.com',
        username: 'admin',
        password: '12345',
        createdAt: new Date(),
      };

      this.users = [defaultAdmin];
      this.saveUsers();
      console.log(
        '✅ Default admin account created (username: admin, password: 12345)',
      );
    }
  }

  // Load users from localStorage
  private loadUsers() {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    if (usersJson) {
      this.users = JSON.parse(usersJson);
      console.log(`📦 Loaded ${this.users.length} user(s) from storage`);
    }
  }

  // Save users to localStorage
  private saveUsers() {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
  }

  // Sign up new user
  signup(
    email: string,
    username: string,
    password: string,
  ): { success: boolean; message: string } {
    // Validate inputs
    if (!email || !username || !password) {
      return { success: false, message: 'All fields are required' };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters',
      };
    }

    // Check if email already exists
    const emailExists = this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (emailExists) {
      return { success: false, message: 'Email already registered' };
    }

    // Check if username already exists
    const usernameExists = this.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
    if (usernameExists) {
      return { success: false, message: 'Username already taken' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now(), // Use timestamp for unique ID
      email: email,
      username: username,
      password: password,
      createdAt: new Date(),
    };

    this.users.push(newUser);
    this.saveUsers();
    console.log(`✅ New user created: ${username}`);

    return { success: true, message: 'Account created successfully!' };
  }

  // Login user
  login(
    identifier: string,
    password: string,
  ): { success: boolean; message: string; user?: User } {
    if (!identifier || !password) {
      return {
        success: false,
        message: 'Please enter email/username and password',
      };
    }

    // Find user by email or username
    const user = this.users.find(
      (u) =>
        (u.email.toLowerCase() === identifier.toLowerCase() ||
          u.username.toLowerCase() === identifier.toLowerCase()) &&
        u.password === password,
    );

    if (user) {
      // Save current user to localStorage (without password for security)
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(
        this.CURRENT_USER_KEY,
        JSON.stringify(userWithoutPassword),
      );
      console.log(`✅ User logged in: ${user.username}`);
      return { success: true, message: 'Login successful!', user };
    } else {
      return { success: false, message: 'Invalid email/username or password' };
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    console.log('👋 User logged out');
  }

  // Get current logged in user
  getCurrentUser(): Omit<User, 'password'> | null {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get all users (for debugging)
  getAllUsers(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...user }) => user);
  }
}
