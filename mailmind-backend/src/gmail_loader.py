import imaplib
import email
from email.header import decode_header

def gmailden_eposta_al(adet, email_adresi, sifre):
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(email_adresi, sifre)
    mail.select("inbox")

    _, mesaj_ids = mail.search(None, "ALL")
    id_listesi = mesaj_ids[0].split()[-adet:]

    eposta_listesi = []
    for mail_id in reversed(id_listesi):
        _, veri = mail.fetch(mail_id, "(RFC822)")
        ham_mesaj = email.message_from_bytes(veri[0][1])
        konu = decode_header(ham_mesaj["Subject"])[0][0]
        konu = konu.decode() if isinstance(konu, bytes) else konu
        gonderen = ham_mesaj["From"]

        icerik = ""
        if ham_mesaj.is_multipart():
            for parcasi in ham_mesaj.walk():
                if parcasi.get_content_type() == "text/plain":
                    icerik = parcasi.get_payload(decode=True).decode(errors="ignore")
                    break
        else:
            icerik = ham_mesaj.get_payload(decode=True).decode(errors="ignore")

        eposta_listesi.append({
            "konu": konu,
            "gonderen": gonderen,
            "icerik": icerik.strip()
        })

    mail.logout()
    return eposta_listesi
