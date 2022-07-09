import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  
  it('handles a signup request', () => {
    const email= 'phielff3@nest.js'
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email, password:'wemove'})
      .expect(201)
      .then((res)=>{
          const{id, email}= res.body;
          expect(id).toBeDefined;
          expect(email).toEqual(email);
      });
  });




  it('signup and then get whoiam', async () => {
    const email= 'phielf@nest.js'
    const res=  request(app.getHttpServer())
      .post('/auth/signup')
      .send({email, password:'wemove'})
      .expect(201)

    const cookie = res.get('Set-Cookie')
    
    const { body } = await request(app.getHttpServer()).get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
    
    expect(body.email).toEqual(email)
  });
});
