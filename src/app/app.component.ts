import { Component } from '@angular/core';
import { UserAuth } from '@app/interfaces/user-auth';
import { AuthService } from '@app/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gonevis';
  isCollapsed: boolean;
  user: UserAuth;

  constructor(private authService: AuthService,
              private translate: TranslateService
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title) {
    this.translate.setDefaultLang('en');
    // Subscribe to AuthService's user changes.
    this.authService.user.subscribe((user: UserAuth): void => {
      this.user = user;
    });
    this.isCollapsed = true;=
    this.translate.setDefaultLang('en');
    // Set window title
    this.router.events.pipe(
      filter((event: RouterEvent): boolean => event instanceof NavigationEnd),
      map((): ActivatedRoute => this.activatedRoute),
      map((route: ActivatedRoute): ActivatedRoute => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route: ActivatedRoute): boolean => route.outlet === 'primary'),
      mergeMap((route: ActivatedRoute): Observable<Data> => route.data),
    ).subscribe((event: Data): void => this.titleService.setTitle(event.title));
  }
}
