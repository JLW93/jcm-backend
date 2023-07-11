const express = require('express');
const axios = require('axios');
const cors = require('cors');
const nodemailer = require('nodemailer');

const pass = require('./pass.json');

const app = express();
const port = 3000;

// const corsOptions = {
//     origin: ['https://benevolent-panda-858374.netlify.app'],
//     methods: ['GET', 'POST', 'OPTIONS']
// };

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jcmlawnservices.ky@gmail.com',
        pass: pass.pass
    }
});

app.options('*', cors());

app.post('/api/data/email', cors(), async (req, res) => {
    try {
        const requestData = req.body;
        console.log(requestData);

        if(!requestData.phone.includes('-')) {
            var phoneNumber = `(${requestData.phone.slice(0,3)}) ${requestData.phone.slice(3,6)}-${requestData.phone.slice(6)}`;
            console.log('phone number creation worked');
        } else {
            var phoneNumber = requestData.phone;
            console.log('phone number creation worked');
        }

        await new Promise((resolve, reject) => {
            transporter.verify(function(error, success) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log('Server is ready to take our messages!');
                    console.log(success);
                }
            });
        });

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
            console.log(mailOptions);

            await new Promise ((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    console.log('send mail function started.');
                    if (error) {
                        console.log('there was an error')
                        console.error(error);
                        reject(error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                })
            })
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
            console.log(mailOptions);

            await new Promise ((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    console.log('send mail function started.');
                    if (error) {
                        console.log('there was an error')
                        console.error(error);
                        reject(error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                })
            })
        }
        console.log('finished');
        res.json({success: true});

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})