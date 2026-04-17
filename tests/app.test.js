import request from 'supertest';
import app from '#src/app';

describe('API Endpoints', () => {
  describe('GET/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health').expect(200);

      expect(res.body).toHaveProperty('status', 'OK');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET/api', () => {
    it('should return API message', async () => {
      const res = await request(app).get('/api').expect(200);

      expect(res.body).toHaveProperty('message', 'Acquisition API is running!');
    });
  });

  describe('GET/nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const res = await request(app).get('/nonexistent').expect(404);

      expect(res.body).toHaveProperty('error', 'Route Not Found');
    });
  });
});
