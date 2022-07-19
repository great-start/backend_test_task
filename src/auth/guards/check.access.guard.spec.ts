import { CheckAccessGuard } from './check.access.guard';

describe('Token.CheckGuard', () => {
  it('should be defined', () => {
    expect(new CheckAccessGuard()).toBeDefined();
  });
});
