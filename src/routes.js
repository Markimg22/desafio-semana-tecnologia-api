const { Router } = require('express');
const { prisma } = require('./lib/prisma');
const createUserController = require('./controllers/create-user-controller');

const routes = Router();

// TODO: Crie as rotas
routes.post('/register', createUserController.handle);
routes.post('/task', async (req, res) => {
    try {

        const { userId, title, description } = req.body;
        if (!userId || !title || !description) {
            return res.status(400).json({
                message: 'Dados inválidos!'
            });
        }
        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!userExists) {
            return res.status(404).json({
                message: 'Usuário não encontrado!'
            });
        }
        await prisma.task.create({
            data: {
                userId, title, description
            }
        });
        return res.status(201).json({
            message: 'Tarefa criada com sucesso!'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro de servidor!'
        });
    }
});

module.exports = { routes };
