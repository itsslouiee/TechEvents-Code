const transporter = require("../config/email");

const sendEmail = async (to, subject, htmlContent) => {
    try {
        await transporter.sendMail({
            from: `"TechEvents" <${process.env.COMPANY_EMAIL}>`,
            to,
            subject,
            html: htmlContent,
        });

        return { success: true, message: "Email sent successfully!" }; 
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Email sending failed", error: error.message }; 
    }
};
// we used success and return, instead of res.status...
// so we can use it inside functions and not only routes 

module.exports = sendEmail;
