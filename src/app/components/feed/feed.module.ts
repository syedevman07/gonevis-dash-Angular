import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBookmark, faComment, faEye, faHeart, faShareSquare } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartFill, faStar, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';

@NgModule({
  declarations: [FeedComponent],
  imports: [
    CommonModule,
    FeedRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    TooltipModule.forRoot(),
    InfiniteScrollModule
  ],
})
export class FeedModule {
  constructor() {
    library.add(faHeart);
    library.add(faHeartFill);
    library.add(faComment);
    library.add(faEye);
    library.add(faBookmark);
    library.add(faShareSquare);
    library.add(faStar);
    library.add(faHashtag);
  }
}
