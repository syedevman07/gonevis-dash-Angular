import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { Params } from '@app/interfaces/params';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { BlogService } from '@app/services/blog/blog.service';
import { Plan } from '@app/shared/locked-feature/shared/enums/plan';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss'],
})
export class AdvancedComponent implements OnInit {

  readonly plan = Plan;

  /**
   * Number of Posts Per Page
   */
  readonly postPerPage: void[] = new Array<void>(24);

  /**
   * Blog settings data
   */
  settings: BlogSettings;

  /**
   * Advanced form
   */
  advancedForm: FormGroup;

  /**
   * Advanced form API error
   */
  advancedFormError: ApiError = {};

  /**
   * remove branding form
   */
  removeBrandingForm: FormGroup;

  /**
   * Google analytics form
   */
  googleAnalyticsForm: FormGroup;

  /**
   * Google adSense form
   */
  googleAdSenseForm: FormGroup;

  /**
   * Advanced form API loading indicator
   */
  advancedLoading: boolean;

  /**
   * Custom footer text API errors
   */
  customFooterTextErrors: ApiError = {};

  /**
   * Google analytics form API errors
   */
  googleAnalyticsErrors: ApiError = {};

  /**
   * Google adSense form API errors
   */
  googleAdSenseErrors: ApiError = {};


  constructor(private formBuilder: FormBuilder,
              private blogService: BlogService,
              private toast: ToastrService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    /**
     * Setup advanced form
     */
    this.advancedForm = this.formBuilder.group({
      meta_description: [null],
      paginate_by: [null],
      commenting: [null],
      voting: [null],
      show_views_count: [null],
      search_engine_visibility: [null],
    });
    /**
     * Setup remove branding form
     */
    this.removeBrandingForm = this.formBuilder.group({
      remove_branding: [null],
      set_footer_text: [null],
    });
    /**
     * Setup google Analytics
     */
    this.googleAnalyticsForm = this.formBuilder.group({
      google_analytics_enabled: [null],
      google_analytics_code: [null],
    });
    /**
     * Setup google adSense form
     */
    this.googleAdSenseForm = this.formBuilder.group({
      google_adsense_enabled: [null],
      google_adsense_code: [null],
    });
    /**
     * Setup advanced form
     */
    this.advancedForm = this.formBuilder.group({
      meta_description: [null],
      paginate_by: [null],
      commenting: [null],
      voting: [null],
      show_views_count: [null],
      search_engine_visibility: [null],
    });
    /**
     * Get blog settings
     */
    this.getSettings();
  }

  /**
   * Get blog settings
   */
  getSettings(): void {
    this.advancedLoading = true;
    this.blogService.getSettings().subscribe((data: BlogSettings): void => {
      this.advancedLoading = false;
      this.settings = data;
      /**
       * Set up the advanced form with default values
       */
      this.advancedForm.patchValue({
        meta_description: this.settings.meta_description,
        paginate_by: this.settings.paginate_by,
        commenting: this.settings.commenting,
        voting: this.settings.voting,
        show_views_count: this.settings.show_views_count,
        search_engine_visibility: this.settings.search_engine_visibility,
      });
      /**
       * Set up the remove branding form with default values
       */
      this.removeBrandingForm.patchValue({
        remove_branding: this.settings.remove_branding,
        set_footer_text: this.settings.footer_text,
      });
      /**
       * Set up the google analytics form with default values
       */
      this.googleAnalyticsForm.patchValue({
        google_analytics_enabled: this.settings.google_analytics_enabled,
        google_analytics_code: this.settings.google_analytics_code,
      });
      /**
       * Set up the google adSense form with default values
       */
      this.googleAdSenseForm.patchValue({
        google_adsense_enabled: this.settings.google_adsense_enabled,
        google_adsense_code: this.settings.google_adsense_code,
      });
    });
  }

  /**
   * Update blog settings
   */
  submit(payload: Params = this.advancedForm.value): void {
    this.advancedLoading = true;
    this.blogService.updateSettings(payload).subscribe((data: BlogSettings): void => {
      this.advancedFormError = {};
      this.advancedLoading = false;
      this.settings = data;
    }, (error: HttpErrorResponseApi): void => {
      this.advancedFormError = error.error;
      this.advancedLoading = false;
      /**
       * Iterate through raised error keys and based on those keys, set error to form controls.
       */
      Object.keys(this.advancedFormError).map((key: string): void => {
        if (this.advancedForm.get(key)) {
          this.advancedForm.get(key).setErrors({ invalid: true });
          this.advancedForm.get(key).markAllAsTouched();
        }
      });
    });
  }

  /**
   * Update remove branding
   */
  updateRemoveBranding(): void {
    this.advancedLoading = true;
    this.blogService.updateRemoveBranding(this.removeBrandingForm.value.remove_branding)
      .subscribe((data: BlogSettings): void => {
        this.advancedLoading = false;
        this.toast.info(this.translate.instant('TOAST_UPDATE'),
          this.translate.instant('REMOVE_GONEVIS_BRANDING'));
        this.settings = data;
      }, () => this.advancedLoading = false);
    this.blogService.updateFooterText(this.removeBrandingForm.value.set_footer_text)
      .subscribe((data: BlogSettings): void => {
        this.advancedLoading = false;
        this.customFooterTextErrors = {};
        this.toast.info(this.translate.instant('TOAST_UPDATE'), this.translate.instant('FOOTER_TEXT'));
        this.settings = data;
      }, (error: HttpErrorResponseApi): void => {
        this.advancedLoading = false;
        this.customFooterTextErrors = error.error;
      });
  }

  /**
   * Update google analytics
   */
  updateGoogleAnalytics(): void {
    this.advancedLoading = true;
    this.blogService.updateGoogleAnalytics(this.googleAnalyticsForm.value)
      .subscribe((data: BlogSettings): void => {
        this.advancedLoading = false;
        this.toast.info(this.translate.instant('TOAST_UPDATE'), this.translate.instant('GOOGLE_ANALYTICS'));
        this.settings = data;
        this.googleAnalyticsErrors = {};
      }, (error: HttpErrorResponseApi): void => {
        this.advancedLoading = false;
        this.googleAnalyticsErrors = error.error;
      });
  }

  /**
   * Update google adSense
   */
  updateGoogleAdSense(): void {
    this.advancedLoading = true;
    this.blogService.updateGoogleAdsense(this.googleAdSenseForm.value).subscribe((data: BlogSettings): void => {
      this.advancedLoading = false;
      this.toast.info(this.translate.instant('TOAST_UPDATE'), this.translate.instant('GOOGLE_ADSENSE'));
      this.settings = data;
      this.googleAdSenseErrors = {};
    }, (error: HttpErrorResponseApi): void => {
      this.advancedLoading = false;
      this.googleAdSenseErrors = error.error;
    });
  }
}
