const nodemailer = require('nodemailer');
const fs = require('fs');
const csvParser = require('csv-parser');

exports.sendBulkEmails = async (req, res) => {
    const { senderName, senderEmail, appPassword, subject, body, bcc } = req.body;
    const filePath = req.file.path;
    let emailList = [];

    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => emailList.push(Object.values(row)[0]))
        .on('end', async () => {
            try {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: senderEmail,
                        pass: appPassword,
                    },
                });

                for (let i = 0; i < emailList.length; i++) {
                    let mailOptions = {
                        from: `${senderName} <${senderEmail}>`,
                        to: emailList[i],
                        bcc,
                        subject,
                        html: body,
                    };
                    await transporter.sendMail(mailOptions);
                    await new Promise(resolve => setTimeout(resolve, 10000)); // 10s delay to avoid spam detection
                }
                res.json({ success: true, message: 'Emails sent successfully!' });
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
};