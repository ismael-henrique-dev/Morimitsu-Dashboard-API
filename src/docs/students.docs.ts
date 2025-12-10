/**
 * @openapi
 * /students/create:
 *   post:
 *     summary: "Cadastrar um aluno"
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - student_phone
 *               - grade
 *               - date_of_birth
 *               - address
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Ismael Silva"
 *               email:
 *                 type: string
 *                 example: "exemple@gmail.com"
 *               student_phone:
 *                 type: string
 *                 example: "9984567890"
 *               grade:
 *                 type: number
 *                 example: 5
 *               date_of_birth:
 *                 type: string
 *                 example: "2008-05-15"
 *               address:
 *                 type: string
 *                 example: "Rua das Flores, 123"
 *               parent_name:
 *                 type: string
 *                 example: "Carlos Silva"
 *               parent_phone:
 *                 type: string
 *                 example: "9976543210"
 *               belt:
 *                 type: string
 *                 example: "blue"
 *               class_id:
 *                 type: string
 *                 example: "8ad64d53-f160-4e49-a314-f47dc55d2af2"
 *               ifce_enrollment:
 *                 type: string
 *                 example: "20220012345678"
 *     responses:
 *       201:
 *         description: "Aluno criado com sucesso!"
 */

/**
 * @openapi
 * /students/{id}:
 *   delete:
 *     summary: "Deletar um aluno pelo ID"
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: "ID do aluno que será deletado"
 *     responses:
 *       200:
 *         description: "Aluno deletado com sucesso!"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aluno deletado com sucesso!"
 *       400:
 *         description: "ID não informado"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID do aluno é necessário"
 *       404:
 *         description: "Aluno não encontrado"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aluno não encontrado"
 *       500:
 *         description: "Erro interno ao deletar aluno"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno ao deletar aluno"
 */

/**
 * @openapi
 * /students/{id}:
 *   patch:
 *     summary: "Atualizar informações de um aluno"
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: "ID do aluno que será atualizado"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "novoemail@gmail.com"
 *               grade:
 *                 type: number
 *                 example: 6
 *               belt:
 *                 type: string
 *                 enum: [white, gray, yellow, orange, blue, purple, brown, black]
 *                 example: "purple"
 *               personal_info:
 *                 type: object
 *                 properties:
 *                   full_name:
 *                     type: string
 *                     example: "Novo Nome"
 *                   parent_name:
 *                     type: string
 *                     example: "Responsável Atualizado"
 *                   parent_phone:
 *                     type: string
 *                     example: "999887766"
 *                   student_phone:
 *                     type: string
 *                     example: "999441122"
 *                   address:
 *                     type: string
 *                     example: "Rua Nova, 502"
 *                   date_of_birth:
 *                     type: string
 *                     format: date
 *                     example: "2009-08-12"
 *     responses:
 *       200:
 *         description: "Aluno atualizado com sucesso!"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aluno atualizado com sucesso!"
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "14d7ef79-e311-4cfa-9f20-ffc6c359f128"
 *                     email:
 *                       type: string
 *                     grade:
 *                       type: number
 *                     belt:
 *                       type: string
 *                     personal_info:
 *                       type: object
 *                       properties:
 *                         full_name:
 *                           type: string
 *                         cpf:
 *                           type: string
 *                           nullable: true
 *                         date_of_birth:
 *                           type: string
 *                           example: "23/04/2025"
 *                         student_phone:
 *                           type: string
 *                         parent_phone:
 *                           type: string
 *                         parent_name:
 *                           type: string
 *                         address:
 *                           type: string
 *       400:
 *         description: "Dados inválidos"
 *       404:
 *         description: "Aluno não encontrado"
 *       500:
 *         description: "Erro interno do servidor"
 */

/**
 * @openapi
 * /students/enroll:
 *   post:
 *     summary: "Enturmar (matricular) um aluno em uma turma"
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - classId
 *             properties:
 *               studentId:
 *                 type: string
 *                 format: uuid
 *                 example: "0f8fad5b-d9cb-469f-a165-70867728950e"
 *               classId:
 *                 type: string
 *                 format: uuid
 *                 example: "8ad64d53-f160-4e49-a314-f47dc55d2af2"
 *     responses:
 *       200:
 *         description: "Aluno enturmado com sucesso!"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aluno enturmado com sucesso!"
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     class_id:
 *                       type: string
 *                     class_name:
 *                       type: string
 *       400:
 *         description: "Erro de validação ou regras de negócio (ex: aluno ou turma não existe)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aluno não encontrado"
 *       500:
 *         description: "Erro interno do servidor"
 */
