import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';

const routes: Routes = [{
  path: '',
  component: SettingsComponent,
  children: [{
    path: 'general',
    loadChildren: () => import('./general/general.module').then(m => m.GeneralModule),
  }, {
    path: 'appearance',
    loadChildren: () => import('./appearance/appearance.module').then(m => m.AppearanceModule),
  }, {
    path: 'advanced',
    loadChildren: () => import('./advanced/advanced.module').then(m => m.AdvancedModule),
  }, {
    path: 'upgrade',
    loadChildren: () => import('./upgrades/upgrades.module').then(m => m.UpgradesModule),
  }, {
    path: 'billing',
    loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule),
  }, {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'general',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {
}
