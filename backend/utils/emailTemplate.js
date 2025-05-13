const approvalEmailTemplate = (organizerName, loginLink) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Approved</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #6a1b9a, #8e24aa);
                    color: #ffffff;
                    text-align: center;
                    padding: 30px 20px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 26px;
                    font-weight: bold;
                }
                .content {
                    padding: 30px 20px;
                    color: #333333;
                    line-height: 1.6;
                    text-align: center;
                }
                .content a {
                    display: inline-block;
                    background: linear-gradient(135deg, #6a1b9a, #8e24aa);
                    color: #ffffff;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    margin: 20px 0;
                    font-weight: bold;
                    font-size: 16px;
                    transition: background 0.3s ease;
                }
                .content a:hover {
                    background: linear-gradient(135deg, #8e24aa, #6a1b9a);
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    background-color: #f5f5f5;
                    color: #777777;
                    font-size: 14px;
                }
                .footer strong {
                    color: #6a1b9a;
                }
                .highlight {
                    color: #6a1b9a;
                    font-weight: bold;
                }
                .emoji {
                    font-size: 24px;
                    vertical-align: middle;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header Section -->
                <div class="header">
                    <h1>Welcome to TechEvents</h1>
                </div>

                <!-- Content Section -->
                <div class="content">
                    <p>Dear <span class="highlight">${organizerName}</span>,</p>
                    <p>We are pleased to inform you that your registration has been <strong>approved</strong>. 🎉</p>
                    <p>You can now log in to your TechEvents account and start posting your events. We’re excited to see what you’ll bring to the platform!</p>
                    <p><a href="${loginLink}">Click here to login</a></p>
                    <p>If you have any questions or need assistance, feel free to reach out to our support team. We’re here to help!</p>
                </div>

                <!-- Footer Section -->
                <div class="footer">
                    <p>Best regards,</p>
                    <p><strong>TechEvents Team</strong></p>
                    <p style="font-size: 12px; color: #999;">You’re receiving this email because you registered on TechEvents.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};



const rejectionEmailTemplate = (organizerName) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Not Approved</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #6a1b9a, #8e24aa);
            color: #ffffff;
            text-align: center;
            padding: 30px 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: bold;
        }
        .content {
            padding: 30px 20px;
            color: #333333;
            line-height: 1.6;
            text-align: center;
        }
        .content a {
            display: inline-block;
            background: linear-gradient(135deg, #6a1b9a, #8e24aa);
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 25px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 16px;
            transition: background 0.3s ease;
        }
        .content a:hover {
            background: linear-gradient(135deg, #8e24aa, #6a1b9a);
        }
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f5f5f5;
            color: #777777;
            font-size: 14px;
        }
        .footer strong {
            color: #6a1b9a;
        }
        .highlight {
            color: #6a1b9a;
            font-weight: bold;
        }
        .emoji {
            font-size: 24px;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="header">
            <h1>TechEvents Registration Update</h1>
        </div>

        <!-- Content Section -->
        <div class="content">
            <p>Dear <span class="highlight">${organizerName}</span>,</p>
            <p>We regret to inform you that your registration has <strong>not been approved</strong> this time.</p>
            <p>Please ensure that you meet the requirements for being an event organizer on TechEvents. If you have any questions or need further clarification, feel free to reach out to us.</p>
            <p>If you believe this is a mistake or would like more information, please contact us at <a href="mailto:techeventsofficial@gmail.com">techeventsofficial@gmail.com</a></p>
            <p>Thank you for your interest in TechEvents! We appreciate your understanding and hope to hear from you again in the future.</p>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <p>Best regards,</p>
            <p><strong>TechEvents Team</strong></p>
            <p style="font-size: 12px; color: #999;">You’re receiving this email because you registered on TechEvents.</p>
        </div>
    </div>
</body>
</html>`;
};

const deletionEmailTemplate = (organizerName) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Removed</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #4a148c, #7b1fa2);
                    color: #ffffff;
                    text-align: center;
                    padding: 30px 20px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 26px;
                    font-weight: bold;
                }
                .content {
                    padding: 30px 20px;
                    color: #333333;
                    line-height: 1.6;
                    text-align: center;
                }
                .content a {
                    display: inline-block;
                    background: linear-gradient(135deg, #4a148c, #7b1fa2);
                    color: #ffffff;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    margin: 20px 0;
                    font-weight: bold;
                    font-size: 16px;
                    transition: background 0.3s ease;
                }
                .content a:hover {
                    background: linear-gradient(135deg, #7b1fa2, #4a148c);
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    background-color: #f5f5f5;
                    color: #777777;
                    font-size: 14px;
                }
                .footer strong {
                    color: #4a148c;
                }
                .highlight {
                    color: #4a148c;
                    font-weight: bold;
                }
                .divider {
                    height: 1px;
                    background-color: #e0e0e0;
                    margin: 20px 0;
                }
                .contact-info {
                    background-color: #f9f9f9;
                    border-left: 4px solid #4a148c;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: left;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header Section -->
                <div class="header">
                    <h1>TechEvents Platform Notice</h1>
                </div>
                <!-- Content Section -->
                <div class="content">
                    <p>Dear <span class="highlight">${organizerName}</span>,</p>
                    <p>We regret to inform you that your organizer account on TechEvents has been <strong>removed</strong>.</p>
                    <p>If you believe this was done in error or would like to discuss this further, please contact our support team.</p>
                    
                    <div class="divider"></div>
                    
                    <div class="contact-info">
                        <p><strong>Need assistance?</strong></p>
                        <p>Email: techeventsofficial@gmail.com</p>
                        <p>Support hours: Sunday-Thursday, 9am-5pm</p>
                    </div>
                    
                    <p>Thank you for your understanding.</p>
                </div>
                <!-- Footer Section -->
                <div class="footer">
                    <p>Best regards,</p>
                    <p><strong>TechEvents Team</strong></p>
                    <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply directly to this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

const eventDeletionEmailTemplate = (eventName, organizerName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
      <h2 style="color: #333;">Event Removed Notification</h2>
      <p>Dear ${organizerName},</p>
      
      <p>We regret to inform you that your event <strong>"${eventName}"</strong> has been removed from our platform.</p>
      
      <p style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
        <strong>Important:</strong> All associated event data, including attendee information and media, has been permanently deleted.
      </p>
      
      <p>If you believe this was done in error, please contact our support team immediately.</p>
      
      <p>Best regards,<br>
      The Events Platform Team</p>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      
      <p style="font-size: 12px; color: #777;">
        This is an automated message. Please do not reply directly to this email.
      </p>
    </div>
  `;
};

// Template d'email pour l'approbation d'événement (version professionnelle)
const eventApprovalEmailTemplate = (event) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <h2 style="color: #4CAF50;">✅ Event Approved</h2>
  <p>Dear Event Organizer,</p>
  <p>We are pleased to inform you that your event <strong>${event.eventName}</strong> has been approved and is now live on our platform.</p>
  
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 15px 0;">
    <p><strong>Event Details:</strong></p>
    <p>📅 Date: ${new Date(event.startDate).toLocaleDateString()} to ${new Date(event.endDate).toLocaleDateString()}</p>
    <p>🔖 Category: ${event.category.join(', ')}</p>
    <p>📍 Location: ${event.locationType === "Onsite" ? `${event.city}` : "Online"}</p>
  </div>
  
  <p>Your event is now visible to all users on the TechEvents platform. We recommend promoting your event through your social media channels for maximum visibility.</p>
  
  <p>Should you need to make any changes to your event details, please contact our support team.</p>
  
  <p>We wish you great success with your event!</p>
  
  <p>Best regards,<br>The TechEvents Team</p>
  
  <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #757575;">
    <p>This is an automated message. Please do not reply to this email.</p>
  </div>
</div>
`;

// 2. Envoyer un email de rejet (template simple)
const eventRejectionEmailTemplate = (eventName) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <h2 style="color: #D32F2F;">❌ Event Review Results</h2>
  <p>Dear Event Organizer,</p>
  <p>Thank you for submitting your event <strong>${eventName}</strong> to TechEvents.</p>
  
  <p>After careful review, we regret to inform you that your event submission does not meet our current platform requirements and has not been approved.</p>
  
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 15px 0;">
    <p><strong>Common reasons for event rejection include:</strong></p>
    <ul style="padding-left: 20px;">
      <li>Incomplete or insufficient event information</li>
      <li>Verification documents not meeting our guidelines</li>
      <li>Event content not aligning with our platform focus</li>
      <li>Quality concerns based on our community standards</li>
    </ul>
  </div>
  
  <p>We encourage you to review our event submission guidelines and consider submitting a revised proposal. Our team is available to provide specific feedback on your submission.</p>
  
  <p>For more details or to discuss this decision, please contact our support team at <a href="mailto:support@techevents.com" style="color: #1976D2;">support@techevents.com</a>.</p>
  
  <p>Thank you for your understanding.</p>
  
  <p>Best regards,<br>The TechEvents Review Team</p>
  
  <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #757575;">
    <p>This is an automated message. For assistance, please contact our support team directly.</p>
  </div>
</div>
`;


module.exports = { approvalEmailTemplate, rejectionEmailTemplate, deletionEmailTemplate, eventRejectionEmailTemplate, eventApprovalEmailTemplate, eventDeletionEmailTemplate};