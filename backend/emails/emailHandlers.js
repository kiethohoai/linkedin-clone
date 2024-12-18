import { mailtrapClient, sender } from '../lib/mailtrap.js';
import { createWelcomeEmailTemplate } from './emailTemplates.js';

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipients = [{ email }];

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: 'Welcome to Unlinked!',
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: 'welcome',
    });

    console.log(`Welcome Email Successfully Sent`, res);
  } catch (error) {
    throw error;
  }
};
