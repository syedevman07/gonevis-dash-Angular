import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectType } from '@app/enums/object-type';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { CommentFeed } from '@app/interfaces/comment-feed';
import { ApiService } from '@app/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get a single comment
   *
   * @param id Entry ID
   * @param commentId Comment ID
   */
  getComment(id: string, commentId: string): Observable<CommentFeed> {
    return this.http.get<CommentFeed>(`${this.apiService.base.zero}website/entry/${id}/comment/${commentId}/`);
  }

  /**
   * Comment on an entry
   *
   * @param id Entry ID
   * @param comment Comment content
   */
  comment(id: string, comment: string): Observable<CommentFeed> {
    return this.http.post<CommentFeed>(`${this.apiService.base.zero}website/entry/${id}/comment/`, {
      comment,
      object_id: ObjectType.ENTRY,
    });
  }

  /**
   * Like or unlike comment for user
   *
   * @param id Comment ID
   */
  like(id: string): Observable<ApiResponseCreated> {
    return this.http.post<ApiResponseCreated>(`${this.apiService.base.v1}sushial/comment/${id}/vote/`, null);
  }

  /**
   * Remove comment
   *
   * @param id Comment ID
   */
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiService.base.v1}sushial/comment/${id}/`);
  }

  /**
   * Edit comment
   *
   * @param id Comment ID
   * @param comment Edited comment
   */
  edit(id: string, comment: string): Observable<CommentFeed> {
    return this.http.put<CommentFeed>(`${this.apiService.base.v1}sushial/comment/${id}/`, { comment });
  }
}