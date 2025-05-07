/**
 * Servicio de envío de correos electrónicos utilizando la API de Brevo
 * Este servicio maneja el envío de correos de verificación y otras notificaciones
 */

import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'http://api.brevo.com/v3/smtp/email';

/**
 * Envía un correo electrónico de verificación a un usuario
 * @param {string} email - Correo electrónico del destinatario
 * @param {string} token - Token de verificación único
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} 
 * Objeto con el resultado de la operación
 * - success: boolean indicando si el envío fue exitoso
 * - data: datos de respuesta de Brevo si fue exitoso
 * - error: mensaje de error si falló
 */
export const sendVerificationEmail = async (email, token) => {
  try {
    console.log('Iniciando envío de correo a:', email);
    const verificationUrl = `http://localhost:3001/users/verify-email?token=${token}`;
    const emailData = {
      sender: {
        name: 'KidsTube',
        email: 'jdavidal17@gmail.com'
      },
      to: [{
        email: email
      }],
      subject: 'Verifica tu cuenta en KidsTube',
      htmlContent: `
        <h1>Bienvenido a KidsTube!</h1>
        <p>Por favor verifica tu cuenta haciendo clic en el siguiente enlace:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>Si no solicitaste este correo, por favor ignóralo.</p>
      `
    };

    console.log('Datos del correo:', JSON.stringify(emailData, null, 2));

    const response = await axios.post(BREVO_API_URL, emailData, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('Respuesta de Brevo:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error detallado al enviar correo:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    return { success: false, error: error.message };
  }
};