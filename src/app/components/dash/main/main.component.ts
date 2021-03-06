import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CommentsService } from '@app/components/dash/comments/comments.service';
import { EntryService } from '@app/components/dash/entry/entry.service';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { MetricStatItem } from '@app/enums/metric-stat-item';
import { MetricStatResolution } from '@app/enums/metric-stat-resolution';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiResponse } from '@app/interfaces/api-response';
import { ReactiveFormData } from '@app/interfaces/reactive-form-data';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Comment } from '@app/interfaces/v1/comment';
import { Entry } from '@app/interfaces/v1/entry';
import { Metrics } from '@app/interfaces/v1/metrics';
import { TemplateConfig } from '@app/interfaces/v1/template-config';
import { BlogService } from '@app/services/blog/blog.service';
import { UtilService } from '@app/services/util/util.service';
import { UsersModalComponent } from '@app/shared/users-modal/users-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faThLarge } from '@fortawesome/free-solid-svg-icons/faThLarge';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BytesPipe } from 'ngx-pipes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [BytesPipe],
})
export class MainComponent implements OnInit, OnDestroy {

  private static readonly POSTS_LIMIT = 10;
  private static readonly COMMENTS_LIMIT = 8;

  readonly faPublications: IconDefinition = faThLarge;
  readonly faComments: IconDefinition = faComments;
  readonly faFollowers: IconDefinition = faUserPlus;
  readonly faFiles: IconDefinition = faDatabase;
  readonly eye: IconDefinition = faEye;
  readonly like: IconDefinition = faThumbsUp;

  readonly entryStatusLabels: string[] = EntryService.STATUS_LABELS;
  readonly metricStatItem = MetricStatItem;

  /**
   * Represents a disposable resource, such as the execution of an Observable. A
   * Subscription has one important method, `unsubscribe`, that takes no argument
   * and just disposes the resource held by the subscription
   */
  private readonly subscription: Subscription = new Subscription();

  /**
   * List of resolutions for statistics panel filter
   */
  readonly statisticsResolutions: MetricStatResolution[] = [
    MetricStatResolution.DAY,
    MetricStatResolution.WEEK,
    MetricStatResolution.MONTH,
    MetricStatResolution.YEAR,
  ];

  /**
   * List of items for statistics panel filter
   */
  readonly statisticsItems: { value: MetricStatItem, label: string }[] = [
    { value: MetricStatItem.VIEWS, label: 'VIEWS_STATISTICS' },
    { value: MetricStatItem.LIKES, label: 'LIKES_STATISTICS' },
    { value: MetricStatItem.COMMENTS, label: 'COMMENTS_STATISTICS' },
  ];

  /**
   * Loading status for each data
   */
  loadingEntries: boolean;

  /**
   * Blog settings data
   */
  blog: BlogSettings;

  /**
   * List of recent blog comments
   */
  comments: Comment[];

  /**
   * List of recent blog entries grouped by status
   */
  entryGroups: {
    status: EntryStatus,
    entries: Entry[],
    dateKey: keyof Entry,
  }[] = [{
    status: EntryStatus.Draft,
    entries: [],
    dateKey: 'created',
  }, {
    status: EntryStatus.Published,
    entries: [],
    dateKey: 'published',
  }];

  /**
   * Metrics (data count, etc)
   */
  metrics: Metrics;

  /**
   * Template config data
   */
  templateConfig: TemplateConfig;

  /**
   * Quick draft
   */
  quickDraftForm: ReactiveFormData = {
    error: {},
  };

  /**
   * Current tab for the panel
   */
  tab: 'entries' | 'comments' = 'entries';

  /**
   * Selected resolution for statistics panel filter
   */
  statisticsResolution = this.statisticsResolutions[0];

  /**
   * Selected item for statistics panel filter
   */
  statisticsItem: { value: MetricStatItem, label: string } = this.statisticsItems[0];

  constructor(public utils: UtilService,
              private activatedRoute: ActivatedRoute,
              private utilService: UtilService,
              private blogService: BlogService,
              private entryService: EntryService,
              private commentsService: CommentsService,
              private modalService: BsModalService,
              private bytes: BytesPipe,
              private formBuilder: FormBuilder,
              private translate: TranslateService) {
  }

  /**
   * @returns Cover image or logo (CSS) of current blog
   */
  blogCover(): SafeStyle {
    if (this.blog) {
      if (this.blog.media.cover_image) {
        return this.utilService.sanitizeBackgroundImage(this.blog.media.cover_image.file);
      }
      if (this.blog.media.logo) {
        return this.utilService.sanitizeBackgroundImage(this.blog.media.logo.file);
      }
    }
  }

  /**
   * @returns Used and free storage in MB
   * @example 120.66 MB / 367.62 MB
   */
  storageTooltip(): string {
    if (this.metrics) {
      const data = this.metrics.metrics.dolphin;
      const used = this.bytes.transform(data.used_storage * 1000000, 1);
      const total = this.bytes.transform((data.used_storage + data.available_storage) * 1000000, 1);
      return `${used} / ${total}`;
    }
  }

  ngOnInit(): void {
    /**
     * Setup quick draft form
     */
    this.quickDraftForm.form = this.formBuilder.group({
      content: ['', Validators.required],
    });
    /**
     * Watch for current blog changes
     */
    this.subscription.add(this.activatedRoute.parent.parent.params.subscribe((): void => {
      /**
       * Reset data
       */
      this.templateConfig = null;
      this.loadingEntries = true;
      for (const group of this.entryGroups) {
        group.entries = [];
      }
      /**
       * Load blog data
       */
      this.blogService.getSettings().subscribe((data: BlogSettings): void => {
        this.blog = data;
      });
      /**
       * Load entries
       */
      this.entryService.getEntries({
        limit: MainComponent.POSTS_LIMIT,
      }).subscribe((response: ApiResponse<Entry>): void => {
        for (const entry of response.results) {
          this.entryGroups[entry.status].entries.push(entry);
        }
        this.loadingEntries = false;
      });
      /**
       * Load comments
       */
      this.commentsService.getComments({
        limit: MainComponent.COMMENTS_LIMIT,
      }).subscribe((response: ApiResponse<Comment>): void => {
        this.comments = response.results;
      });
      /**
       * Load metrics
       */
      this.blogService.getMetrics().subscribe((data: Metrics): void => {
        this.metrics = data;
      });
      /**
       * Load template config (for owner and admins)
       */
      if (BlogService.currentBlog.role !== TeamRoles.Editor) {
        this.blogService.getTemplateConfig().subscribe((data: { template_config: TemplateConfig }): void => {
          this.templateConfig = data.template_config;
        });
      }
    }));
  }

  /**
   * Show modal to show blog followers
   */
  showSubscribers(): void {
    this.modalService.show(UsersModalComponent);
  }

  submitQuickDraft(): void {
    this.quickDraftForm.loading = true;
    this.entryService.draft(
      this.translate.instant('QUICK_DRAFT'),
      this.quickDraftForm.form.get('content').value,
    ).subscribe((): void => {
      this.quickDraftForm.loading = false;
      this.quickDraftForm.form.reset();
    });
  }

  ngOnDestroy(): void {
    /**
     * Disposes the resources held by the subscription
     */
    this.subscription.unsubscribe();
  }
}
