import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  ForbiddenException,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { UsersRole } from 'src/enum/users-role'

@Injectable()
export class AdminRoleInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || user.role !== UsersRole.ADMIN) {
      throw new ForbiddenException("Access denied")
    }

    return next.handle()
  }
}