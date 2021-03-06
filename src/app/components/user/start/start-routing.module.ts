import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartComponent } from 'src/app/components/user/start/start.component';

const routes: Routes = [{
  path: '',
  component: StartComponent,
  data: {
    title: 'START',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartRoutingModule {
}
