const request = require('supertest');
const { setupApp } = require('../src/app');
const { prisma } = require('../src/lib/prisma');

jest.setTimeout(60000);

describe('User Routes', () => {
    let app;

    beforeAll(() => {
        app = setupApp();
    });

    afterAll(async () => {
        await prisma.task.deleteMany();
        await prisma.user.deleteMany();
    });

    describe('POST /register', () => {
        test('caso o usuário seja criado com sucesso, deverá retornar status 201, e os dados do usuário criado', async () => {
            const email = 'any_valid@mail.com';
            const user = await request(app)
                .post('/register')
                .send({ email })
                .expect(201);
            expect(user.body.id).toBeTruthy();
            expect(user.body.email).toBe(email);
        });

        test('caso seja passado um e-mail inválido, retorne status 400 e mensagem: "E-mail inválido!"', async () => {
            const result = await request(app)
                .post('/register')
                .send({ email: 'invalid@mail' })
                .expect(400);
            expect(result.body.message).toBe('E-mail inválido!');
        });

        test('caso seja passado um e-mail em uso, retorne status 400 e mensagem: "E-mail já cadastrado!"', async () => {
            const email = 'any@mail.com';
            await prisma.user.create({
                data: { email }
            });
            const result = await request(app)
                .post('/register')
                .send({ email })
                .expect(400);
            expect(result.body.message).toBe('E-mail já cadastrado!');
        });

        test('caso ocorra um erro interno, retorne o status 500 e a mensage: "Erro de servidor!"', async () => {
            jest.spyOn(prisma.user, 'create').mockImplementationOnce(() => { throw new Error(); });
            const result = await request(app)
                .post('/register')
                .send({ email: 'any2@mail.com' })
                .expect(500);
            expect(result.body.message).toBe('Erro de servidor!');
        });
    });
});
