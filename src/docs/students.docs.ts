/**
 * @openapi
 * /students/create:
 *   post:
 *     summary: Cadastrar um aluno
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
 *
 *               email:
 *                 type: string
 *                 example: "exemple@gmail.com"
 *
 *               student_phone:
 *                 type: string
 *                 example: "9984567890"
 *
 *               grade:
 *                 type: number
 *                 example: 5
 *
 *               date_of_birth:
 *                 type: string
 *                 example: "2008-05-15"
 *
 *               address:
 *                 type: string
 *                 example: "Rua das Flores, 123"
 *
 *               parent_name:
 *                 type: string
 *                 example: "Carlos Silva"
 *
 *               parent_phone:
 *                 type: string
 *                 example: "9976543210"
 *
 *               belt:
 *                 type: string
 *                 example: "blue"
 *
 *               class_id:
 *                 type: string
 *                 example: "8ad64d53-f160-4e49-a314-f47dc55d2af2"
 *
 *               ifce_enrollment:
 *                 type: string
 *                 example: "20220012345678"
 *
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso!
 */
