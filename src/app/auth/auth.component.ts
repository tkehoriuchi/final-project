import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
    isLoginMode = true;
    isLoading = false;
    // error: string = null;
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

    private closeSub: Subscription;

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        let authObservable: Observable<AuthResponseData>;
        
        this.isLoading = true;
        
        if (this.isLoginMode) {
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.signup(email, password);
        }

        authObservable.subscribe(
            responseData => {
                console.log(responseData);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                console.log(errorMessage);
                // this.error = errorMessage;
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
            }
        );

        form.reset();
    }

    ngOnDestroy() {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }

    // onHandleError() {
    //     this.error = null;
    // }

    // This method will programatically create a component
    private showErrorAlert(errorMessage: string) {
        // const alertComponent = new AlertComponent(); // this doesn't work!
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainterRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

        componentRef.instance.message = errorMessage;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }
}