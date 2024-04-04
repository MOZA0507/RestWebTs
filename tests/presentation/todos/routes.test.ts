
import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('Todo route testing', () => {

  beforeAll(async ()=>{
    await testServer.start();
  });

  beforeAll(async ()=>{
    await prisma.todo.deleteMany();
  });

  afterAll(() => {
    testServer.close();
  });


  const todo1 = {text: 'Hola mundo 1'};
  const todo2 = {text: 'Hola Mundo 2'};

  test('Should return TODOs api/todos', async() => {
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });
    
    const {body} = await request(testServer.app)
      .get('/api/todos')
      .expect(200);
    
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);

  });

  test('Should return a TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });
    const {body} = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: todo.completedAt
    });
  });

  test('Should return a 404 NotFound at api/todos/:id', async () =>{

    const todoId = 999
    const {body} = await request(testServer.app)
      .get(`/api/todos/${todoId}`)
      .expect(404);

    expect(body).toEqual({error: `Todo with id ${todoId} not found`});
  });

  test('Should return a new TODO api/todos', async() => {
    const {body} = await request(testServer.app)
      .post('/api/todos')
      .send(todo1)
      .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null,
    });
  });

  test('Should return an error if text is not present api/todos', async() => {
    const {body} = await request(testServer.app)
      .post('/api/todos')
      .send({})
      .expect(400);

    expect(body).toEqual({ error: 'Text property is required' });
  });

  test('Should return an error if text is empty api/todos', async() => {
    const {body} = await request(testServer.app)
      .post('/api/todos')
      .send({text: ''})
      .expect(400);

    expect(body).toEqual({ error: 'Text property is required' });
  });

  test('Should return an updated TODO api/todos/:id', async() => {
    const todo = await prisma.todo.create({data: todo1});
    const {body} = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({text: 'Hello world updated todo', completedAt: '2023-10-11'})
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: 'Hello world updated todo',
      completedAt: '2023-10-11T00:00:00.000Z'
    });
  });

  test('Should return 404 if TODO is not found', async () => {
    const idTest = 999;
    const {body} = await request(testServer.app)
      .put(`/api/todos/${idTest}`)
      .send({text: 'Hello world updated todo', completedAt: '2023-10-11'})
      .expect(404);

    expect(body).toEqual({error: `Todo with id ${idTest} not found`})
  });

  test('Should return an updated TODO only the date', async () => {
    const todo = await prisma.todo.create({data: todo1});
    const {body} = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({completedAt: '2023-10-11'})
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: '2023-10-11T00:00:00.000Z'
    });
  });

  
  test('Should return an updated TODO only the text', async () => {
    const todo = await prisma.todo.create({data: todo1});
    const {body} = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({text: 'Hello world updated todo'})
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: 'Hello world updated todo',
      completedAt: todo.completedAt,
    });
  });

  test('Should delete a TODO api/todos/:id', async() => {
    const todo = await prisma.todo.create({data: todo1});
    const {body} = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: null 
    });
    console.log(body);
  });

  test('Should return 404 if to do doesnt exist api/todos/:id', async() => {
    const idTest = 999
    const {body} = await request(testServer.app)
      .delete(`/api/todos/${idTest}`)
      .expect(404);

    console.log(body);
    expect(body).toEqual({ error: `Todo with id ${idTest} not found` });
    // expect(body).toEqual({
    //   id: expect.any(Number),
    //   text: todo.text,
    //   completedAt: null 
    // });

  });
});