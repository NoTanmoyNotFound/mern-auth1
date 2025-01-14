import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });
        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification`, error);
        throw new error(`Error sending verification email: ${error}`);
    }

}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid:"6eb606bb-0ba6-48be-ac6c-9e56715f5499",
            template_variables: {
                "company_info_name": "Auth Company",
                "name": name
              }
        });
        console.log("Welcome Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new error(`Error sending welcome email: ${error}`);
    }
}