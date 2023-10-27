import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service'; // Importação atualizada aqui
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
    userForm: FormGroup;
    editingUser: User | null = null;

    get nameControl() { return this.userForm.get('name'); }
    get emailControl() { return this.userForm.get('email'); }
    get bdayControl() { return this.userForm.get('bday'); }

    constructor(
        private userService: UserService, 
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) { 
        this.userForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            bday: ['', Validators.required]
        });
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, 'Fechar', {
            duration: 5000,
        });
    }

    transformToDateInputFormat(date: string): Date {
        const [day, month, year] = date.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day));
    }
    
    ngOnInit(): void {
        const userIdStr = this.route.snapshot.paramMap.get('id');
        if (userIdStr) {
            const userId = +userIdStr;
            const userToEdit = this.userService.getUsers().find(user => user.id === userId);
            if (userToEdit) {
                this.editingUser = userToEdit;
    
                const parts = userToEdit.bday.split('/');
                const convertedDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    
                this.userForm.setValue({
                    name: userToEdit.name,
                    email: userToEdit.email,
                    bday: convertedDate
                });
            }
        }
    }
    
    saveUser() {
        const formattedDate = formatDate(this.userForm.value.bday, 'dd/MM/yyyy', 'en-US');
        
        if (this.editingUser) {
            const updatedUser: User = {
                id: this.editingUser.id,
                ...this.userForm.value,
                bday: formattedDate
            };
            this.userService.editUser(updatedUser);
        } else {
            const newUser: User = {
                id: Date.now(),
                ...this.userForm.value,
                bday: formattedDate
            };
            this.userService.addUser(newUser);
        }
        
        this.openSnackBar(this.editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
        this.router.navigate(['/']);
    }
}
