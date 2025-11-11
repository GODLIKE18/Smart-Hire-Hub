import request from 'supertest';
import app from '../app.js';
import { describe, it, expect } from 'vitest';

describe('Health endpoint', () => {
  it('returns ok true', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
