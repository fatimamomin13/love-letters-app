// letterTemplate.js - Create this file in your project

export function generateLetterHTML({ letterTo, letterFrom, message }) {
	return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Letter</title>
    <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap"
        rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            overflow: hidden;
        }

        .letter-page {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            padding: 50px;
            background-image: url('https://i.postimg.cc/bw7mXzTr/Colorful-Vintage-Letter-A4-Document.png');
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            box-sizing: border-box;
            /* Important for proper sizing */

        }

        @page {
            size: A4;
            margin: 0;
        }

        .greeting {
            position: absolute;
            top: 250px;
            left: 50px;
            font-size: 30px;
            font-family: "Dancing Script";
            color: #3e1212;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
        }


        .message-wrapper {
            position: absolute;
            top: 310px;
            left: 50px;
            width: calc(100% - 280px);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .message {
            font-size: 26px;
            font-weight: 400;
            line-height: 1.6;
            color: #3e1212;
            text-align: left;
            font-family: "Dancing Script";
            white-space: pre-wrap;
            text-indent: 0;
        }

        .footer {
            position: absolute;
            bottom: 70px;
            left: 50px;
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 18px;
        }

        .footer-text {
            color: #3e1212;
            font-family: "Dancing Script";
        }

        .with-love {
            font-size: 30px;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .sender-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 5px;
        }

        .sender-name {
            font-size: 30px;
            font-weight: 700;
            font-family: "Dancing Script";
        }


        @media print {
            .letter-page {
                margin: 0;
                box-shadow: none;
            }
        }
    </style>
</head>

<body>
    <div class="letter-page">
        <!-- Paper background -->
        <div class="paper-background"></div>

        <!-- Greeting -->
        <div class="greeting">
            <span>My Dearest ${letterTo} </span>
        </div>

        <!-- Message -->
        <div class="message-wrapper">
            <div class="message">${message}</div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-text">
                <div class="with-love">With Love,</div>
                <div class="sender-row">
                    <span class="sender-name">${letterFrom}</span>
                </div>
            </div>
        </div>

    </div>
</body>

</html>`;
}
