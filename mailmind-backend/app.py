from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import imaplib
import os
import re
from src.data_loader import load_emails
from src.ai_core import process_single_email
from src.gmail_loader import gmailden_eposta_al
from src.email_sender import mail_gonder
from flask_cors import cross_origin



app = Flask(__name__)
CORS(app)

# Yardımcı fonksiyonlar
def normalize(text):
    return re.sub(r'[^\w\s]', '', text.lower().strip())

def clean_duplicate_subject(konu, icerik):
    if not konu or not icerik:
        return icerik
    konu_norm = normalize(konu)
    icerik_norm = normalize(icerik)
    if icerik_norm.startswith(konu_norm[:len(konu_norm)//2]):
        cut_index = len(konu)
        if icerik[cut_index:cut_index+2] == ". ":
            cut_index += 2
        elif icerik[cut_index:cut_index+1] == ".":
            cut_index += 1
        return icerik[cut_index:].lstrip().capitalize()
    return icerik


import imaplib

@app.route('/gmail-giris', methods=['POST', 'OPTIONS'])
def gmail_giris():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # GMAIL hesabına bağlanmayı DENE!
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(email, password)
        mail.logout()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": f"Giriş başarısız: {str(e)}"}), 401


@app.route('/eposta-al', methods=['POST', 'OPTIONS'])
def eposta_al():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    adet = data.get('adet', 10)

    try:
        # DİKKAT: Parametre sırası doğru olmalı!
        mailler = gmailden_eposta_al(adet, email, password)
        # Frontend'te kullandığın isimlere uygun gönder:
        # konu→subject, gonderen→from, icerik→body
        mailler2 = [
            {"subject": m["konu"], "from": m["gonderen"], "body": m["icerik"]}
            for m in mailler
        ]
        return jsonify({"emails": mailler2}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/api/load-json", methods=["POST"])
def load_json():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "Dosya bulunamadı"}), 400
    try:
        emails = load_emails(file)
        return jsonify({"emails": emails.to_dict(orient="records")})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

<<<<<<< HEAD
=======

>>>>>>> 845e371 (Dosya adı değiştirildi ve güncellemeler yapıldı)
@app.route('/eposta-analiz', methods=['POST'])
def eposta_analiz():
    data = request.get_json()
    mailler = data.get("emails", [])
    analiz_sonuclari = []

    for mail in mailler:
        konu = mail.get("subject", "")
        icerik = mail.get("body", "")
        analiz = process_single_email(konu, icerik)
        analiz_sonuclari.append(analiz)

    return jsonify({"analizler": analiz_sonuclari}), 200


@app.route('/gmail-yanit-gonder', methods=['POST'])
def gmail_yanit_gonder():
    data = request.json
    gonderen = data.get("gonderen")
    sifre = data.get("sifre")
    alici = data.get("alici")
    konu = data.get("konu")
    mesaj = data.get("mesaj")
    sonuc = mail_gonder(gonderen, sifre, alici, konu, mesaj)
    if sonuc is True:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": str(sonuc)})
if __name__ == "__main__":
    app.run(debug=True)
