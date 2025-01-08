const {sendEmail}=require('../Utils/EmailSender.js');

const sendActivationcode = async (email,username ,activationCode)=>{
    const options = {
        to: email,
        from: `"نبتة" <${process.env.EMAIL}>`,
        subject: 'Activation Account',
        html: `<!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تفعيل الحساب</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Cairo', sans-serif;
                background-color: #f3f4f6;
                padding: 20px;
                direction: rtl;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                text-align: center;
                color: #2f3e46;
            }
            .logo img {
                width: 80px;
                height: auto;
            }
            .activation-code {
                font-size: 24px;
                font-weight: bold;
                color: #2f3e46;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <img src="https://res.cloudinary.com/duscvark1/image/upload/v1731417256/b4ekom5pnspedhouwbwt.png" alt="Logo">
            </div>
            <h2 style="color: #355c7d; font-size: 24px;">👋 مرحباً بك يا ${username}</h2>
            <p style="font-size: 18px; margin: 5px 0;">🌱!أهلاً بك في نبتة</p>
            <p style="font-size: 16px; color: #555;">شكراً لتسجيلك في تطبيق نبتة.</p>
            <p style="font-size: 16px; color: #555; margin: 20px 0;">
                لضمان أمان حسابك وتفعيل بريدك الإلكتروني، يرجى إدخال كود التفعيل التالي داخل التطبيق:
            </p>
            <div class="activation-code">
                ${activationCode[0]}  ${activationCode[1]}  ${activationCode[2]}  ${activationCode[3]}  ${activationCode[4]}  ${activationCode[5]}
            </div>
            <p style="font-size: 14px; color: #777;">
                إذا لم تطلب تفعيل الحساب، يمكنك تجاهل هذه الرسالة بأمان.
            </p>
            <p style="font-size: 16px; color: #555;">
                تحيات فريق نبتة
            </p>
        </div>
    </body>
    </html>`
    };
     
    await sendEmail(options);
} 

const sendForgetPasswordCode=async (email,username,code)=>{
    const option={
        from:`نبتة" <${process.env.EMAIL}>`,
        to :email,
        subject:"reset password",
        html:`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>استعادة كلمة المرور</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Cairo', sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo -->
        <img src="https://res.cloudinary.com/duscvark1/image/upload/v1731417256/b4ekom5pnspedhouwbwt.png" alt="نبتة" style="width: 100px; margin-bottom: 20px;">

        <!-- Welcome Message -->
        <h2 style="color: #4CAF50; font-size: 24px;">${username}مرحباً بك يا  👋</h2>
        <p style="font-size: 18px; color: #555;">استعادة كلمة المرور الخاصة بك في نبتة</p>

        <!-- Info Text -->
        <p style="font-size: 16px; color: #777;">
            لقد طلبت استعادة كلمة المرور لحسابك في تطبيق نبتة. لا تقلق، نحن هنا لمساعدتك!
        </p>

        <!-- Code Instruction -->
        <p style="font-size: 16px; color: #555;">
            استخدم كود إعادة التعيين التالي داخل التطبيق لإعداد كلمة مرور جديدة:
        </p>

        <!-- Example Reset Code -->
        <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">${code[0]} ${code[1]} ${code[2]} ${code[3]} ${code[4]} ${code[5]}</p>

        <!-- Additional Info -->
        <p style="font-size: 14px; color: #777;">
            إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان، وسيظل حسابك محمياً.
        </p>

        <!-- Signature -->
        <p style="font-size: 16px; color: #555;">
            نتمنى لك يوماً سعيداً!<br>
            تحيات فريق نبتة
        </p>
    </div>
</body>
</html>`    

    }
    sendEmail(option);
}

module.exports={sendActivationcode,sendForgetPasswordCode };