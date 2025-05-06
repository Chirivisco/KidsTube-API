import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];

// Verificar que la API key existe
if (!process.env.BREVO_SMS_API_KEY) {
    console.error('BREVO_SMS_API_KEY no está definida en las variables de entorno');
    throw new Error('BREVO_SMS_API_KEY no está configurada');
}

apiKey.apiKey = process.env.BREVO_SMS_API_KEY;
console.log('API Key SMS configurada:', process.env.BREVO_SMS_API_KEY ? 'Sí' : 'No');

const apiInstance = new SibApiV3Sdk.TransactionalSMSApi();

/**
 * Genera un código de verificación aleatorio de 6 dígitos
 * @returns {string} Código de verificación
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const formatPhoneNumber = (phoneNumber) => {
  // Si el número ya tiene el prefijo +506, lo dejamos como está
  if (phoneNumber.startsWith('+506')) {
    return phoneNumber;
  }
  // Si el número comienza con 506, agregamos el +
  if (phoneNumber.startsWith('506')) {
    return `+${phoneNumber}`;
  }
  // Si el número comienza con 0, lo removemos y agregamos +506
  if (phoneNumber.startsWith('0')) {
    return `+506${phoneNumber.substring(1)}`;
  }
  // Para cualquier otro caso, agregamos +506
  return `+506${phoneNumber}`;
};

/**
 * Envía un código de verificación por SMS
 * @param {string} phoneNumber - Número de teléfono del destinatario
 * @param {string} code - Código de verificación
 * @returns {Promise<Object>} Resultado del envío
 */
const sendVerificationSMS = async (phoneNumber, code) => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log('Enviando SMS a:', formattedPhone);

    const sendTransacSms = new SibApiV3Sdk.SendTransacSms();
    sendTransacSms.sender = "KidsTube";
    sendTransacSms.recipient = formattedPhone;
    sendTransacSms.content = `Tu código de verificación de KidsTube es: ${code}. Válido por 10 minutos.`;
    sendTransacSms.type = "transactional";

    console.log('Configuración del SMS:', {
      sender: sendTransacSms.sender,
      recipient: sendTransacSms.recipient,
      content: sendTransacSms.content,
      type: sendTransacSms.type
    });

    const result = await apiInstance.sendTransacSms(sendTransacSms);
    console.log('SMS enviado exitosamente:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error detallado al enviar SMS:', {
      message: error.message,
      status: error.status,
      response: error.response?.body
    });
    return { success: false, error: error.message };
  }
};

export { generateVerificationCode, sendVerificationSMS }; 