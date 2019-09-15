import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Plan } from '@app/interfaces/plan';
import { Subscription } from '@app/interfaces/subscription';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsUpgradeService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get plans
   */
  getPlans(): Observable<ApiResponse<Plan>> {
    return this.http.get<ApiResponse<Plan>>(`${this.apiService.base.v1}eskenas/plans/`);
  }

  /**
   * Get current subscription
   */
  getSubscription(): Observable<{ subscription: Subscription }> {
    const blogId: string = BlogService.currentBlog.id;
    return this.http.get<{ subscription: Subscription }>(
      `${this.apiService.base.v1}website/site/${blogId}/subscription/`,
    );
  }
}
