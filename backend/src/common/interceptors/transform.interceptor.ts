import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Wraps controller return values into the project-wide response shape:
 *   { data: {} }              for single resources
 *   { data: [], meta: {} }    for paginated collections
 *
 * A service/controller can return either:
 *   - a plain value / entity          -> wrapped as { data: value }
 *   - a PaginatedResult already shaped -> passed through as { data, meta }
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, { data: T } | PaginatedResult<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ data: T } | PaginatedResult<T>> {
    return next.handle().pipe(
      map((result) => {
        if (
          result &&
          typeof result === 'object' &&
          'data' in result &&
          'meta' in result
        ) {
          return result as PaginatedResult<T>;
        }
        return { data: result };
      }),
    );
  }
}
