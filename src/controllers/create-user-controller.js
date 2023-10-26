const { prisma } = require('../lib/prisma');

class CreateUserController {
    async handle(request, response) {
        try {
            const { email } = request.body;
            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regexEmail.test(email)) {
                return response.status(400).json({
                    message: 'E-mail inválido!'
                });
            }
            const userExists = await prisma.user.findUnique({ where: { email } });
            if (userExists) {
                return response.status(400).json({
                    message: 'E-mail já cadastrado!'
                });
            }
            const user = await prisma.user.create({
                data: { email }
            });
            return response.status(201).json(user);
        } catch (error) {
            return response.status(500).json({
                message: 'Erro de servidor!'
            });
        }
    }
}

module.exports = new CreateUserController();
