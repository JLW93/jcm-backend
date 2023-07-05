const express = require('express');
const axios = require('axios');
const cors = require('cors');
const nodemailer = require('nodemailer');

const pass = require('./pass.json');

const app = express();
const port = 3000;

app.use(express.json());

const corsOptions = {
    origin: 'https://jcm-frontend.vercel.app',
    credentials: true,
};

app.use(cors(corsOptions));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jcmlawnservices.ky@gmail.com',
        pass: pass.pass
    }
});

app.post('/api/data/email', async (req, res) => {
    try {
        const requestData = req.body;
        console.log(requestData);

        if(!requestData.phone.includes('-')) {
            var phoneNumber = `(${requestData.phone.slice(0,3)}) ${requestData.phone.slice(3,6)}-${requestData.phone.slice(6)}`
        } else {
            var phoneNumber = requestData.phone;
        }

        if(requestData.desired_service == 'quote') {
            const mailOptions = {
                from: 'jcmlawnservices.ky@gmail.com',
                to: 'jcmlawnservices.ky@gmail.com',
                subject: '[QUOTE] Customer Contact Request',
                html: 
                `
                <h1>Name: ${requestData.first_name} ${requestData.last_name}</h1>
                <h2>Phone Number: ${phoneNumber}</h2>
                <h3>Email Address: ${requestData.email}</h2>
                <h3>Requested date of service: ${requestData.date}</h3>
                <h3>Service(s) requested: ${requestData.type_of_service}</h3>
                <p><strong>Message:</strong> ${requestData.message}</p>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });

        } else if(requestData.desired_service == 'schedule_service') {
            const mailOptions = {
                from: 'jcmlawnservices.ky@gmail.com',
                to: 'jcmlawnservices.ky@gmail.com',
                subject: '[SERVICE] Customer Contact Request',
                html: 
                `
                <h1>Name: ${requestData.first_name} ${requestData.last_name}</h1>
                <h2>Phone Number: ${phoneNumber}</h2>
                <h2>Email Address: ${requestData.email}</h2>
                <h3>Requested date of service: ${requestData.date}</h3>
                <h3>Service(s) requested: ${requestData.type_of_service}</h3>
                <p><strong>Message:</strong> ${requestData.message}</p>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });

        }

        res.json({success: true});

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})