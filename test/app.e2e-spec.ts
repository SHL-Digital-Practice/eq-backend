import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  let sessionId: number;
  it('creates a session', async () => {
    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({ ownerId: 1 })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    sessionId = response.body.id as number;
  });

  it('add elements to a session', async () => {
    await request(app.getHttpServer())
      .post('/elements')
      .query({ sessionId })
      .send([
        {
          applicationId: '123',
          properties: { name: 'Room A', area: 10 },
          type: 'room',
        },
        {
          applicationId: '456',
          properties: { name: 'Room B', area: 20 },
          type: 'room',
        },
      ])
      .expect(201);
  });

  it('updates elements on a session', async () => {
    await request(app.getHttpServer())
      .patch('/elements')
      .query({ sessionId })
      .send([
        {
          applicationId: '123',
          properties: { name: 'Room A', area: 15 },
          type: 'room',
        },
        {
          applicationId: '456',
          properties: { name: 'Room B', area: 25 },
          type: 'room',
        },
      ])
      .expect(200);
  });

  it('removes elements from a session', async () => {
    await request(app.getHttpServer())
      .delete('/elements')
      .query({ sessionId })
      .send(['123', '456'])
      .expect(200);
  });

  it('saves a snapshot of the session', async () => {
    await request(app.getHttpServer())
      .post(`/sessions/${sessionId}/save`)
      .expect(201);
  });

  it('throws an error if add elements to a sessions that has been saved', async () => {
    const response = await request(app.getHttpServer())
      .post('/elements')
      .query({ sessionId })
      .send([
        {
          applicationId: '123',
          properties: { name: 'Room A', area: 10 },
          type: 'room',
        },
        {
          applicationId: '456',
          properties: { name: 'Room B', area: 20 },
          type: 'room',
        },
      ])
      .expect(400);

    expect(response.body.message).toBe('Session is closed');
  });
});
