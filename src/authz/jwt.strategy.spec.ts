import { JwtStrategy } from './jwt.strategy';

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
