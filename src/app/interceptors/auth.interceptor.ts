import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = 'An unexpected error occurred. Please try again.';


        if (error.error) {
          if (typeof error.error === 'string') {
            try {
              const parsed = JSON.parse(error.error);
              errorMsg = parsed.message || parsed.error || error.error;
            } catch {
              errorMsg = error.error; 
            }
          } else if (error.error.message) {
            errorMsg = error.error.message;
          }
        }


        if (error.status === 401 || error.status === 403) {
          this.showErrorToast('Your session has expired or you do not have permission.');
          this.authService.logout();
        } else {
          this.showErrorToast(errorMsg);
        }

        return throwError(() => new Error(errorMsg));
      })
    );
  }

  private showErrorToast(message: string): void {
    const toast = document.createElement('div');
    
    toast.className = 'fixed top-6 right-6 bg-red-600 text-white px-5 py-4 rounded-xl shadow-2xl z-[9999] transform transition-all duration-500 ease-in-out translate-x-full flex items-center gap-4 border border-red-400';
    
    toast.innerHTML = `
      <div class="bg-white/20 p-2 rounded-full flex-shrink-0">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      <div class="flex flex-col">
        <span class="font-bold text-sm tracking-wide">System Error</span>
        <span class="text-xs text-red-100 mt-0.5 break-words max-w-xs">${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-x-full');
      toast.classList.add('translate-x-0');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('translate-x-0');
      toast.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 4500);
  }
}