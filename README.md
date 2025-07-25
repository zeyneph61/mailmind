
# MailMind Akademik E-Posta Asistanı

Bu proje, akademik e-postalarınızı yapay zekâ ile özetleyen, kategorize eden ve otomatik yanıt öneren bir web uygulamasıdır.

> JSON dosyası yerine Gmail'den çekmenin daha yararlı olduğunu düşünüp Yağmur hocaya sorarak değiştirdim.  
> Diğer arkadaşlarımızdan aldığım tavsiyeler üzerine de küçük, verimsiz modellerdense **gpt-4o-mini**'ye geçiş yaptım.

---

## Demo Hesap ve API Bilgileri

- **E-Posta:** mailmind.test01@gmail.com
- **Şifre:** juqflcdoeddarina
- 
---

## Kurulum & Çalıştırma

1. **Proje klasörünü indir ve bir klasöre çıkar:**

   ```
   mailmind-proje/
   ├── mailmind-backend/
   ├── mailmind-frontend/
   └── README.md
   ```

2. **Backend’i başlat:**
   ```bash
   cd mailmind-backend
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   # source venv/bin/activate
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend’i başlat:**
   ```bash
   cd ../mailmind-frontend/mailmind-ui
   npm install
   npm run dev
   ```

4. **Tarayıcıdan aç:**  
   [http://localhost:5173](http://localhost:5173)

---

## Kısa Açıklama

- Uygulama Gmail hesabınızdan son e-postaları çeker.
- GPT-4o-mini ile e-postalarınızı özetler, kategorize eder ve otomatik yanıt önerir.
- Otomatik yanıtlar kullanıcı tarafından değiştirilebilir ve göndermek için tek tık yeterlidir.
- Proje tamamen lokal çalışır, herhangi bir bulut sunucusu gerekmez.

---

## Notlar

- Hem backend hem frontend’i **farklı terminal pencerelerinde** başlatmalısın.
- API anahtarını ve e-posta şifresini kimseyle paylaşma!
- Sorun yaşarsan önce terminalde hata mesajlarını kontrol et.

---

Proje sahibi: **Zeynep Hacısalihoğlu**
