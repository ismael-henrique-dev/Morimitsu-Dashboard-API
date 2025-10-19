/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
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
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Realiza cadastro de usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
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