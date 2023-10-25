const request = require('supertest');
const { setupApp } = require('../src/app');
const { prisma } = require('../src/lib/prisma');

jest.setTimeout(60000);

describe('Task Routes', () => {
    let app;
    let user;

    beforeAll(async () => {
        app = setupApp();
        user = await prisma.user.create({ data: { email: 'any@mail.com' } });
    });

    afterAll(async () => {
        await prisma.task.deleteMany();
        await prisma.user.deleteMany();
    });

    describe('POST /task', () => {
        test('caso não passe algum dos dados "title" ou "description", retorne status 400 e mensagem: "Dados inválidos!"', async () => {
            const resultOne = await request(app)
                .post('/task')
                .send({ title: 'Any Title' })
                .expect(400);
            const resultTwo = await request(app)
                .post('/task')
                .send({ description: 'Any description' })
                .expect(400);
            expect(resultOne.body.message).toBe('Dados inválidos!');
            expect(resultTwo.body.message).toBe('Dados inválidos!');
        });

        test('caso tente criar uma tarefa para um usuário que não exista, mostre status 404 e mensagem: "Usuário não encontrado!"', async () => {
            const result = await request(app)
                .post('/task')
                .send({ userId: 'any_id', title: 'Any Title', description: 'Any description' })
                .expect(404);
            expect(result.body.message).toBe('Usuário não encontrado!');
        });

        test('caso ocorra um erro interno, retorne o status 500 e a mensage: "Erro de servidor!"', async () => {
            jest.spyOn(prisma.task, 'create').mockImplementationOnce(() => { throw new Error(); });
            const result = await request(app)
                .post('/task')
                .send({ userId: user.id, title: 'Any Title', description: 'Any description' })
                .expect(500);
            expect(result.body.message).toBe('Erro de servidor!');
        });

        test('caso a tarefa seja criada com sucesso, deverá retornar status 201 e a mensagem: "Tarefa criada com sucesso!"', async () => {
            const result = await request(app)
                .post('/task')
                .send({ userId: user.id, title: 'Any Title', description: 'Any description' })
                .expect(201);
            expect(result.body.message).toBe('Tarefa criada com sucesso!');
        });
    });

    describe('GET /tasks', () => {
        test('caso tente listar tarefas de um usuário que não exista, retorne status 404 e mensagem: "Usuário não encontrado!"', async () => {
            const result = await request(app)
                .get('/tasks')
                .send({ userId: 'any_id' })
                .expect(404);
            expect(result.body.message).toBe('Usuário não encontrado!');
        });

        test('caso ocorra um erro interno, retorne o status 500 e a mensage: "Erro de servidor!"', async () => {
            jest.spyOn(prisma.task, 'findMany').mockImplementationOnce(() => { throw new Error(); });
            const result = await request(app)
                .get('/tasks')
                .send({ userId: user.id })
                .expect(500);
            expect(result.body.message).toBe('Erro de servidor!');
        });

        test('caso retorne as tarefas corretamente deverá retornar status 200 e a lista de tarefas', async () => {
            const result = await request(app)
                .get('/tasks')
                .send({ userId: user.id })
                .expect(200);
            expect(Array.isArray(result.body)).toBe(true);
            expect(result.body[0].userId).toBe(user.id);
        });
    });

    describe('DELETE /task', () => {
        test('caso o usuário tente deletar uma tarefa que não exista, ou tente deletar uma tarefa de outro usuário, mostre status 404 e mensagem: "Tarefa não encontrada!"', async () => {
            const result = await request(app)
                .delete('/task')
                .send({ userId: user.id, taskId: 'invalid_id' })
                .expect(404);
            expect(result.body.message).toBe('Tarefa não encontrada!');
        });

        test('caso ocorra um erro interno, retorne o status 500 e a mensage: "Erro de servidor!"', async () => {
            jest.spyOn(prisma.task, 'findFirst').mockImplementationOnce(() => { throw new Error(); });
            const result = await request(app)
                .delete('/task')
                .send({ taskId: 'any_id', userId: 'any_id' })
                .expect(500);
            expect(result.body.message).toBe('Erro de servidor!');
        });

        test('após deletar uma tarefa deverá retornar o status 200 e a mensagem "Tarefa deletada com sucesso!"', async () => {
            const taskCreated = await prisma.task.create({
                data: {
                    title: 'Any Title',
                    description: 'Any Description',
                    userId: user.id
                }
            });
            const result = await request(app)
                .delete('/task')
                .send({ userId: user.id, taskId: taskCreated.id })
                .expect(200);
            expect(result.body.message).toBe('Tarefa deletada com sucesso!');
        });
    });

    describe('PUT /task', () => {
        test('caso o usuário tente atualizar uma tarefa que não exista, mostre status 404 e mensagem: "Tarefa não encontrada!"', async () => {
            const result = await request(app)
                .put('/task')
                .send({ userId: 'any_id', taskId: 'invalid_id' })
                .expect(404);
            expect(result.body.message).toBe('Tarefa não encontrada!');
        });

        test('caso ocorra um erro interno, retorne o status 500 e a mensage: "Erro de servidor!"', async () => {
            jest.spyOn(prisma.task, 'findFirst').mockImplementationOnce(() => { throw new Error(); });
            const result = await request(app)
                .put('/task')
                .send({ userId: 'any_id', taskId: 'any_id' })
                .expect(500);
            expect(result.body.message).toBe('Erro de servidor!');
        });

        test('ao atualizar a tarefa retorne status 200 e uma mensagem "Tarefa atualizada com sucesso!"', async () => {
            const taskCreated = await prisma.task.create({
                data: {
                    userId: user.id,
                    title: 'Any Title',
                    description: 'Any Description'
                }
            });

            const result1 = await request(app)
                .put('/task')
                .send({ userId: user.id, taskId: taskCreated.id, title: 'Any Title Updated' })
                .expect(200);
            const result2 = await request(app)
                .put('/task')
                .send({ userId: user.id, taskId: taskCreated.id, description: 'Any Description Updated' })
                .expect(200);
            const result3 = await request(app)
                .put('/task')
                .send({ userId: user.id, taskId: taskCreated.id, finished: true })
                .expect(200);

            const taskUpdated = await prisma.task.findUnique({ where: { id: taskCreated.id } });

            expect(taskUpdated.title).toBe('Any Title Updated');
            expect(taskUpdated.description).toBe('Any Description Updated');
            expect(taskUpdated.finished).toBe(true);
            expect(result1.body.message).toBe('Tarefa atualizada com sucesso!');
            expect(result2.body.message).toBe('Tarefa atualizada com sucesso!');
            expect(result3.body.message).toBe('Tarefa atualizada com sucesso!');
        });
    });
});
