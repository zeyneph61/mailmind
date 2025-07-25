import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def mail_gonder(gonderen, sifre, alici, konu, mesaj):
    try:
        msg = MIMEMultipart()
        msg["From"] = gonderen
        msg["To"] = alici
        msg["Subject"] = konu

        msg.attach(MIMEText(mesaj, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(gonderen, sifre)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        return str(e)
