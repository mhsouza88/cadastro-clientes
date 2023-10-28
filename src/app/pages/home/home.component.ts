import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../shared/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'email', 'bday', 'actions'];
    dataSource: User[] = [];

    constructor(
        private router: Router, 
        private userService: UserService, 
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    addUser() {
        this.router.navigate(['/edit']);
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.dataSource = this.userService.getUsers();
    }

    editUser(user: User) {
        this.router.navigate(['/edit', user.id]);
    }    

    deleteUser(userId: number): void {
        const dialogRef = this.dialog.open(ModalComponent, {
          width: '20rem',
          data: { message: 'Quer mesmo deletar este usuário?' }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userService.deleteUser(userId);
                this.loadUsers();
                this.snackBar.open('Usuário deletado com sucesso!', 'Fechar', {
                    duration: 5000,
                });
            }
        });
    } 
}
