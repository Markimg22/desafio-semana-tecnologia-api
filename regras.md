# Regras de Negócio para aprovação do Desafio

### PROBLEMA:
Estou buscando um sistema que permita que meus usuários se cadastrem via e-mail e tenham a capacidade de gerenciar tarefas, realizar cadastros, atualizações, listagens e exclusões.

---

### 1.Cadastrar Usuário - POST /register
##### BODY
```json
{
    "email": "Algum e-mail válido"
}
```
- [] o usuário deverá ser cadastrado com um e-mail válido
- [] o e-mail deverá ser passado no corpo da requisição
- [] caso seja passado um e-mail inválido, retorne status 400 e mensagem: "E-mail inválido!"
- [] caso seja passado um e-mail em uso, retorne status 400 e mensagem: "E-mail já cadastrado!"
- [] caso o usuário seja criado com sucesso, deverá retornar status 201, e os dados do usuário criado
- [] caso ocorra um erro interno, retorne o status 500 e a mensage: "Erro de servidor!"

### 2.Cadastrar Tarefa - POST /task
##### BODY
```json
{
    "userId": "ID de algum usuário cadastrado",
    "title": "Algum título para a tarefa",
    "description": "Alguma descrição para a tarefa"
}
```
- [] cada usuário poderá cadastrar várias tarefas, e será registrada com o "title" e "description"
- [] os dados anteriores deverão vir no corpo da requisição
- [] caso não passe algum os dados anteriores, retorne status 400 e mensagem: "Dados inválidos!"
- [] caso tente criar uma tarefa para um usuário que não exista, mostre status 404 e mensagem: "Usuário não encontrado!"
- [] caso a tarefa seja criada com sucesso, deverá retornar status 201 e a mensagem: "Tarefa criada com sucesso!"
- [] caso ocorra um erro interno, retorne o status 500 e a mensage: "Erro de servidor!"

### 3.Listar Tarefas - GET /tasks
##### BODY
```json
{
    "userId": "ID de algum usuário cadastrado"
}
```
- [] para listar as tarefas precisa passar o "id" do usuário no corpo da requisição
- [] deverá listar apenas as tarefas cadastradas para aquele usuário
- [] caso tente listar tarefas de um usuário que não exista, retorne status 404 e mensagem: "Usuário não encontrado!"
- [] caso retorne as tarefas corretamente deverá retornar status 200 e a lista de tarefas
- [] caso ocorra um erro interno, retorne o status 500 e a mensage: "Erro de servidor!"

### 4.Deletar Tarefa - DELETE /task
##### BODY
```json
{
    "userId": "ID de algum usuário cadastrado",
    "taskId": "ID de alguma tarefa do usuário a ser deletada"
}
```
- [] para deletar uma tarefa precisa passar o "id" da tarefa e do usuário no corpo da requisição
- [] caso o usuário tente deletar uma tarefa que não exista, ou tente deletar uma tarefa de outro usuário, mostre status 404 e mensagem: "Tarefa não encontrada!"
- [] após deletar uma tarefa deverá retornar o status 200 e a mensagem "Tarefa deletada com sucesso!"
- [] caso ocorra um erro interno, retorne o status 500 e a mensage: "Erro de servidor!"

### 5. Atualizar Tarefa - PUT /task
##### BODY
```json
{
    "userId": "ID de algum usuário cadastrado",
    "taskId": "ID de alguma tarefa do usuário a ser deletada",
    "title": "Título da tarefa a ser atualizado",               // opcional
    "description": "Descrição da tarefa a ser atualizado",      // opcional
    "finished": true                                            // opcional
}
```
- [] poderá atualizar os campos de "title", "description" e "finished"
- [] só atualizará o(s) campo(s) específico(s) que for(em) passado(s) no corpo da requisição
- [] o usário poderá atualizar apenas a tarefa relacionada a ele
- [] será atualizada apenas uma tarefa de acordo com o "id" da tarefa e do usuário passado no corpo da requisição
- [] ao atualizar a tarefa retorne status 200 e uma mensagem "Tarefa atualizada com sucesso!"
- [] caso o usuário tente atualizar uma tarefa que não exista ou uma tarefa não vinculada a ele, mostre status 404 e mensagem: "Tarefa não encontrada!"
- [] caso ocorra um erro interno, retorne o status 500 e a mensage: "Erro de servidor!"
