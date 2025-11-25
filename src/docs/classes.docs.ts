/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login de usuário
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
 *                 example: "usuario@email.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 */

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
 *               - name
 *               - min_age
 *               - max_age
 *               - schedule
 *               - instructor_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Turma Infantil"
 *               min_age:
 *                 type: number
 *                 example: 4
 *               max_age:
 *                 type: number
 *                 example: 10
 *               schedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dayOfWeek:
 *                       type: string
 *                       example: "quarta"
 *                     time:
 *                       type: string
 *                       example: "13:00"
 *               instructor_id:
 *                 type: string
 *                 example: "8ad64d53-f160-4e49-a314-f47dc55d2af2"
 *     responses:
 *       200:
 *         description: Turma criada com sucesso!
 */

/**
 * @openapi
 * /classes/delete/{id}:
 *   delete:
 *     summary: Excluir turma
 *     tags:
 *       - Classes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Turma deletada com sucesso
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
 *         schema:
 *           type: string
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
 *                 type: number
 *                 example: 12
 *               max_age:
 *                 type: number
 *                 example: 16
 *               schedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dayOfWeek:
 *                       type: string
 *                       example: "terça"
 *                     time:
 *                       type: string
 *                       example: "18:00"
 *               instructor_id:
 *                 type: string
 *                 example: "d4e5f6a7-b8c9-1234-d5e6-f7a8b9c0d1e2"
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 */

/**
 * @openapi
 * /classes/search/{search}:
 *   get:
 *     summary: Buscar turma por nome ou listar todas
 *     tags:
 *       - Classes
 *     parameters:
 *       - in: path
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de turmas encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       min_age:
 *                         type: number
 *                       max_age:
 *                         type: number
 *                       schedule:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             dayOfWeek:
 *                               type: string
 *                             time:
 *                               type: string
 *                       instructor_id:
 *                         type: string
 */
