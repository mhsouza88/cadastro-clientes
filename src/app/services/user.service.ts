import { Injectable } from '@angular/core';

export interface User {
    id: number;
    name: string;
    email: string;
    bday: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private nextId: number = 1;
  private readonly USERS_KEY = 'users';
  private readonly NEXT_ID_KEY = 'nextId';

  constructor() {
    this.loadFromLocalStorage();
  }

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    user.id = this.nextId++;
    this.users.push(user);
    this.saveToLocalStorage();
  }

  editUser(updatedUser: User): void {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.saveToLocalStorage();
    }
  }

  deleteUser(userId: number): void {
    const index = this.users.findIndex(user => user.id === userId);
    if (index > -1) {
      this.users.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  private loadFromLocalStorage(): void {
    const storedUsers = localStorage.getItem(this.USERS_KEY);
    const storedNextId = localStorage.getItem(this.NEXT_ID_KEY);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
    if (storedNextId) {
      this.nextId = JSON.parse(storedNextId);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
    localStorage.setItem(this.NEXT_ID_KEY, JSON.stringify(this.nextId));
  }
}
