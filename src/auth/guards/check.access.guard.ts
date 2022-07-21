import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class CheckAccessGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // check access
    try {
      request.user = await this.authService.checkAccess(request);

      return true;
    } catch (e) {
      throw new UnauthorizedException(
        {
          message: e.response?.message,
          error: e.response?.error,
          statusCode: e.response?.statusCode,
        },
        e.message,
      );
    }
  }
}
