import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryComponent } from '@app/components/feed/entry/entry.component';
import { CommentFormModule } from '@app/shared/comment-form/comment-form.module';
import { EntryListModule } from '@app/shared/entry-list/entry-list.module';
import { ShareModule } from '@app/shared/share/share.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBookmark } from '@fortawesome/free-regular-svg-icons/faBookmark';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faShareSquare } from '@fortawesome/free-regular-svg-icons/faShareSquare';
import { faHeart as faHeartFill, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkFill } from '@fortawesome/free-solid-svg-icons/faBookmark';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { EntryRoutingModule } from './entry-routing.module';

@NgModule({
  declarations: [EntryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EntryRoutingModule,
    ShareModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    TranslateModule.forChild(),
    EntryListModule,
    CommentFormModule,
    InfiniteScrollModule,
  ],
})
export class EntryModule {
  constructor() {
    library.add(faHeart);
    library.add(faHeartFill);
    library.add(faComment);
    library.add(faEye);
    library.add(faBookmark);
    library.add(faBookmarkFill);
    library.add(faShareSquare);
    library.add(faPaperPlane);
    library.add(faEdit);
    library.add(faTrash);
  }
}
