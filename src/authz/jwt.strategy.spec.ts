import { JwtStrategy } from './jwt.strategy';
import { PermissionsGuard } from '../permissions.guard';
import { createMock } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('jwt strategy', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

  it('should create the strategy object', () => {
    const strategy = new JwtStrategy();
    expect(strategy.name).toEqual('jwt');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'jwt' }),
    );
  });
  it("should blindly return payloads as they've already been validated", () => {
    const strategy = new JwtStrategy();
    expect(strategy.validate({ test: 'object' })).toEqual({ test: 'object' });
  });
});

describe('permissions guard', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

  it('should spot matching permissions', () => {
    const reflector = createMock<Reflector>({
      get: (permissions, handler) => ['admin'],
    });
    const context = createMock<ExecutionContext>({
      getArgs: () => [
        {
          user: {
            permissions: ['admin'],
          },
        },
      ],
    });

    const guard = new PermissionsGuard(reflector);
    expect(guard.canActivate(context)).toEqual(true);
  });

  it('should spot missing permissions', () => {
    const reflector = createMock<Reflector>({
      get: (permissions, handler) => ['admin'],
    });
    const context = createMock<ExecutionContext>({
      getArgs: () => [
        {
          user: {
            permissions: ['user'],
          },
        },
      ],
    });

    const guard = new PermissionsGuard(reflector);
    expect(guard.canActivate(context)).toEqual(false);
  });

  it('should not block routes wihout a guard', () => {
    const reflector = createMock<Reflector>({
      get: (permissions, handler) => null,
    });
    const context = createMock<ExecutionContext>({
      getArgs: () => [
        {
          user: {
            permissions: ['whatever'],
          },
        },
      ],
    });

    const guard = new PermissionsGuard(reflector);
    expect(guard.canActivate(context)).toEqual(true);
  });
});
