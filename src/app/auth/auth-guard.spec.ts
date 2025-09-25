import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './auth-guard';

describe('authGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard]
    });
    guard = TestBed.inject(AuthGuard);
  });

  const executeGuard: CanActivateFn = (route, state) =>
    guard.canActivate(route, state);

  it('should be created', () => {
    const mockRoute = {} as any;
    const mockState = {} as any;
    expect(executeGuard(mockRoute, mockState)).toBeTruthy();
  });
});