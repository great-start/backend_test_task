import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { constants } from '../../constants/constants';
import { TokenService } from '../token/token.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class CheckAccessGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // check access
    try {
      const authHeader = request.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('No token');
      }

      const { accessToken } = await this.tokenService.findToken(token);

      if (!accessToken) {
        throw new UnauthorizedException('Permission denied');
      }

      const { email } = await this.tokenService.verifyToken(token);
      const existingUser = await this.userService.findOneByEmail(email);

      if (!existingUser) {
        throw new UnauthorizedException('Permision demied');
      }

      request.user = existingUser;
      return true;
    } catch (e) {
      throw new UnauthorizedException(e.response?.error, e.message);
    }
  }
}
