/**
 * @openapi
 * /classes/create:
 *   post:
 *     summary: Criar turma
 *     tags:
 *       - Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@email.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT de autenticação
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YWQ2NGQ1My1mMTYwLTRlNDktYTMxNC1mNDdkYzU1ZDJhZjEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjA4MzkwNDUsImV4cCI6MTc2MDg0NjI0NX0.lUZNgZf3kuYgRdwFbuQxN-UA5-f7x3QUgPpR6pFgi7E"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "5ad64d53-f160-4e49-a314-f47dc55d2af1"
 *                     username:
 *                       type: string
 *                       example: "Saulo Bezerra"
 *                     email:
 *                       type: string
 *                       example: "admin@gmail.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       400:
 *         description: Erro de validação (Zod)
 *       401:
 *         description: Email ou senha incorretos
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * /**
 * @openapi
 * /classes/delete/{id}:
 *   delete:
 *     summary: Deletar uma turma pelo ID
 *     tags:
 *       - Classes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da turma a ser deletada
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-5678-90ab-cdef-1234567890ab"
 *     responses:
 *       200:
 *         description: Turma deletada com sucesso
 *       400:
 *         description: Erro de validação(Zod)
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno no servidor
 */
/**
 * @openapi
 * /classes/update/{id}:
 *   put:
 *     summary: Atualizar dados de uma turma
 *     tags:
 *       - Classes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da turma
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-5678-90ab-cdef-1234567890ab"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Turma Juvenil"
 *               min_age:
 *                 type: integer
 *                 example: 12
 *               max_age:
 *                 type: integer
 *                 example: 16
 *               schedule:
 *                 type: string
 *                 example: "Terça e Quinta - 18h às 20h"
 *               instructor_id:
 *                 type: string
 *                 format: uuid
 *                 example: "d4e5f6a7-b8c9-1234-d5e6-f7a8b9c0d1e2"
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 *       400:
 *         description: Erro de validação (Zod)
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
/**
 * @openapi
 * /classes/search/{search}:
 *   get:
 *     summary: Buscar turma pelo nome (ou ID) ou listar todas as turmas
 *     description: >
 *       Retorna uma ou mais turmas de acordo com o parâmetro informado.  
 *       - Se for informado um **nome parcial**, retorna as turmas correspondentes.  
 *       - Se **nenhum parâmetro** for informado, retorna **todas as turmas** cadastradas.
 *     tags:
 *       - Classes
 *     parameters:
 *       - in: path
 *         name: search
 *         required: false
 *         description: Nome (ou parte do nome) da turma para buscar. Caso omitido, retorna todas as turmas.
 *         schema:
 *           type: string
 *           example: "Infantil"
 *     responses:
 *       200:
 *         description: Lista de turmas ou turma específica encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Turmas encontradas com sucesso"
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "a1b2c3d4-5678-90ab-cdef-1234567890ab"
 *                       name:
 *                         type: string
 *                         example: "Turma Infantil"
 *                       min_age:
 *                         type: integer
 *                         example: 6
 *                       max_age:
 *                         type: integer
 *                         example: 10
 *                       schedule:
 *                         type: string
 *                         example: "Segunda e Quarta - 14h às 16h"
 *                       instructor_id:
 *                         type: string
 *                         format: uuid
 *                         example: "5ad64d53-f160-4e49-a314-f47dc55d2af1"
 *       400:
 *         description: Erro de validação(Zod)
 *       404:
 *         description: Nenhuma turma encontrada
 *       500:
 *         description: Erro interno do servidor
 */
