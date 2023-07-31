const { Pact } = require('@pact-foundation/pact');
const path = require('path');

const provider = new Pact({
  consumer: 'Consumer',
  provider: 'Provider',
  port: 4000,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'INFO',
});

describe('Movies Service', () => {
  describe('When a request to list all movies is made', () => {
    beforeAll(() =>
      provider.setup().then(() => {
        provider.addInteraction({
          uponReceiving: 'a request to list all movies',
          withRequest: {
            method: 'GET',
            path: '/movies',
          },
          willRespondWith: {
            status: 200,
            body: eachLike(
              {
                id: 1,
                name: like('Movie 1'),
                year: like(1999),
              },
              { min: 5 }
            ),
          },
        });
      })
    );

    test('should return the correct data', async () => {
      const response = await fetchMovies(URL, PORT);
      expect(response[0].name).toBe('Movie 1');
      expect(response[0].year).toBe(1999);
    });

    afterEach(() => provider.verify());
    afterAll(() => provider.finalize());
  });
});