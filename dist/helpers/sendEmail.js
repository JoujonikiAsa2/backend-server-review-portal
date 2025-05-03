"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendMail = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config_1.default.nodemailer_email,
            pass: config_1.default.nodemailer_password,
        },
    });
    const mailOptions = {
        from: "Product Review Website",
        to: payload.email,
        subject: payload.subject,
        html: `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title> 
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 22px;
            font-weight: bold;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content h2 {
            color: #333;
        }
        .content p {
            color: #666;
            font-size: 16px;
        }
        .details {
            background-color: #f9f9f9;
            padding: 15px;
            margin-top: 15px;
            border-radius: 5px;
            text-align: left;
        }
        .details p {
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            color: #777;
            font-size: 14px;
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            🎉 Payment Successful!
        </div>
        <div class="content">
            <h2>Dear ${payload.name},</h2>
            <p>We are delighted to inform you that your payment has been successfully processed.</p>
            <div class="details">
                <p><strong>Transaction ID:</strong> ${payload.transactionId}</p>
                <p><strong>Amount Paid:</strong> &#x09F3;${payload.amount}</p>
                <p><strong>Date:</strong> ${new Date(payload.completedAt)}</p>
                <p><strong>Review Name:</strong> ${payload.reviewId}</p>
            </div>
            <p>Thank you for your payment. We are excited to have you in our portal!</p>
        </div>
        <div class="footer">
            If you have any questions, feel free to <a href="mail to: support@pulsedu.com">contact us</a>. <br>
            &copy; 2025 Product Review. All Rights Reserved.
        </div>
    </div>

</body>
</html>

    `,
    };
    try {
        let info = yield transporter.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        console.log("Error:", error);
        return false;
    }
});
exports.default = sendMail;
