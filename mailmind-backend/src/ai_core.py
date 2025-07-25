import os
from transformers import pipeline
import re
from openai import OpenAI
from dotenv import load_dotenv



load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

def summarize_email(text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "En fazla 2 cümleyle 1 cümle de olur, kısa ,anlamlı,resmi şekilde özetle. 3.kişi kullan."},
            {"role": "user", "content": text}
        ],
        max_tokens=100,
        temperature=0.3
    )
    return response.choices[0].message.content.strip()


def categorize_email(text, konu=""):
    text_lower = text.lower()
    konu_lower = konu.lower()

    # Anahtar kelimeye dayalı hızlı eşleştirme (öncelikli)
    if "yaz okulu" in text_lower or "yaz okulu" in konu_lower:
        return "yaz okulu"

    # Anahtar kelime eşleşmesi başarısızsa GPT-4o ile sınıflandır
    full_text = f"Konu: {konu}\nİçerik: {text}"
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Sen bir e-posta sınıflandırıcısısın. "
                        "Aşağıdaki e-postayı sadece şu kategorilerden biriyle doğru etiketle: "
                        "staj, toplantı, ödev, sınav, ders, yaz okulu, etkinlik, izin, işbirliği, tavsiye, kütüphane, burs, diğer"
                        "Sadece kategori adını yaz, başka hiçbir şey ekleme."
                    )
                },
                {
                    "role": "user",
                    "content": full_text
                }
            ],
            temperature=0
        )
        kategori = response.choices[0].message.content.strip().lower()
        return kategori
    except Exception as e:
        print(f"Hata oluştu: {e}")
        return "diğer"  # varsayılan kategori


def suggest_response(category, text):
    responses = {
        "staj": {
            "online": "Stajınızı online yapmanız mümkündür. Ancak, şirketten resmi bir onay belgesi almanız gereklidir.",
            "belge": "Zorunlu staj belgelerinin son teslim tarihi 15 Ağustos 2025’tir. Lütfen bu tarihe kadar bölüm sekreterliğine ulaştırınız.",
            "sigorta": "SGK işlemleri için formunuzu en geç bir hafta önceden teslim etmeniz gereklidir.",
            "başlangıç": "Staj başlangıç tarihi sınavlar bittikten sonra olmalıdır.",
            "default": "Bu e-posta için hazır bir yanıt bulunmamaktadır. Lütfen kendiniz uygun bir yanıt giriniz."
        },
        "ödev": {
            "son teslim": "Ödevin son teslim tarihi danışmanınız tarafından belirlenir. Lütfen kontrol ediniz.",
            "geç teslim": "Geç teslim durumunda danışman onayı gereklidir. Lütfen mazeretinizi belirtin.",
            "sistem": "Sistemsel sorun yaşarsanız ekran görüntüsü ile beraber bilgi işlem birimine başvurun.",
            "format": "Ödevinizi PDF formatında ve dosya adında öğrenci numaranızı belirterek yükleyiniz.",
            "grup": "Grup arkadaşlarıyla yaşanan sorunlar için durumu açıkça belirtmeniz gereklidir.",
            "default": "Ödevle ilgili mesajınız alınmıştır. En kısa sürede dönüş yapılacaktır."
        },
        "sınav": {
            "ne zaman": "Sınav sonuçları ilan tarihinden itibaren 1 hafta içinde açıklanacaktır.",
            "iptal": "Sınav iptaline dair resmi duyurular sadece bölüm sayfasından yapılır.",
            "sınav yeri": "Sınav salon bilgileri otomasyon sisteminde yer almaktadır.",
            "cevap anahtarı": "Cevap anahtarı itiraz süresi 3 gündür. Gerekli belgelerle başvurabilirsiniz.",
            "mazeret": "Raporlu iseniz mazeret sınavı için başvuru yapabilirsiniz.",
            "not": "Not itirazı için danışman hocanıza veya dersi veren öğretim üyesine yazılı olarak başvurabilirsiniz.",
            "kağıt": "Sınav kağıdınızı incelemek istiyorsanız, lütfen danışman hocanızdan randevu alınız.",
            "default": "Sınavla ilgili genel sorular için bölüm sekreterliği ile iletişime geçebilirsiniz."
        },
        "toplantı": {
            "danışmanlık": "Danışmanlık saatleri her hafta Pazartesi güncellenmektedir.",
            "tez": "Tez ön savunması için jüri önerinizi danışman hocanıza iletmeniz yeterlidir.",
            "sunum": "Haftalık sunumlar için konunuzu 2 gün önceden bildirmeniz rica olunur.",
            "default": "Toplantı konunuz danışman hocanıza iletilecektir."
        },
        "ders": {
            "çakışma": "Ders çakışmaları için öğrenci işleri ile iletişime geçmelisiniz.",
            "erişim": "OBS erişim sorunları için kullanıcı adınızı belirterek bildirim yapınız.",
            "yüz yüze": "Bu haftaki ders yüz yüze olarak planlanmıştır.",
            "default": "Dersle ilgili sorunuz danışmanınıza iletilmiştir."
        },
        "etkinlik": {
            "katılım": "Etkinliğe katılım zorunlu değildir ancak önerilir.",
            "mezuniyet": "Mezuniyet etkinlik takvimi bölüm web sitesinde yayınlanacaktır.",
            "katılım belgesi": "Katılım belgesi etkinlik bitiminde e-posta ile gönderilecektir.",
            "panel": "Panel saat bilgisi ve oturum listesi afişte yer almaktadır.",
            "default": "Etkinlikle ilgili detaylar bölüm panosunda duyurulacaktır."
        },
        "işbirliği": {
            "tübitak": "TÜBİTAK projeleri için ortaklık önerinizi proje döneminden önce bildirmeniz gerekir.",
            "konferans": "Konferans bildirileri için son özet gönderim tarihine dikkat ediniz.",
            "veri seti": "Veri seti erişimi için ilgili çalışmaya atıf yapılması gereklidir.",
            "default": "İşbirliği öneriniz ilgili akademisyene iletilecektir."
        },
        "tavsiye": {
            "yurt dışı": "Referans mektubu için başvuru belgelerinizi ve tarih bilgisini iletiniz.",
            "tübitak": "TÜBİTAK başvurusu için tavsiye yazısı taslağını paylaşırsanız süreci hızlandırırız.",
            "lisansüstü": "Lisansüstü başvurular için öneri yazısı üniversite e-posta adresinize gönderilecektir.",
            "default": "Tavsiye mektubu talepleriniz sıraya alındı, dönüş yapılacaktır."
        },
        "kütüphane": {
            "uzatma": "Kitap uzatma işlemleri kütüphane sisteminden yapılabilir.",
            "ceza": "Geç iade cezaları sistem tarafından otomatik olarak yansıtılır.",
            "rezerv": "Rezerv kaynaklar belirli saatlerde teslim alınabilir.",
            "default": "Kütüphane işlemleri için doğrudan kütüphane personeliyle iletişim kurunuz."
        },
        "burs": {
            "başvuru": "Burs başvuruları öğrenci işleri sistemi üzerinden yapılmaktadır.",
            "form": "Burs başvuru formunuzu eksiksiz doldurup yüklemeniz gereklidir.",
            "sonuç": "Burs sonuçları akademik takvimde belirtilen tarihlerde ilan edilir.",
            "Referans":"Referans mektubu için başvuru belgelerinizi ve tarih bilgisini iletiniz.",
            "default": "Bursla ilgili güncel bilgiler öğrenci işleri sayfasında yer almaktadır."
        },
        "yaz okulu": {
            "ders açılma": "Yaz okulunda açılacak dersler fakülte tarafından belirlenip ilan edilecektir.",
            "ücret": "Yaz okulu ücretleri her yıl üniversite yönetimi tarafından belirlenir ve web sitesinde duyurulur.",
            "başvuru": "Yaz okulu başvuruları akademik takvime göre yapılmaktadır. Takipte kalınız.",
            "çakışma": "Ders çakışması durumunda öğrenci işleri ile iletişime geçebilirsiniz.",
            "default": "Yaz okulu hakkında detaylı bilgi için fakültenizin web sayfasını kontrol ediniz."
        },
        "izin": {
            "rapor": "Sağlık raporunuzu sisteme yükledikten sonra devamsızlık durumunuz değerlendirilecektir.",
            "ailevi": "Ailevi sebeplerle alınan izinler için danışman hocanızla iletişime geçmeniz gerekmektedir.",
            "yurtdışı": "Yurt dışı görevleriniz için resmi yazı sunmanız yeterlidir. Dersi telafi edebilirsiniz.",
            "devamsızlık": "Raporunuz onaylandığı takdirde devamsızlık hakkınız etkilenmez.",
            "default": "İzin konusuyla ilgili özel bir durum varsa danışmanınıza bildirmeniz önerilir."
        },
        "diğer": {
            "default": "Bu e-posta için hazır bir yanıt bulunmamaktadır. Lütfen kendiniz uygun bir yanıt giriniz."
        }

    }

    keyword_map = {
        "staj": [
            ("online", ["online", "remote", "uzaktan", "evden"]),
            ("belge", ["belge", "form", "teslim", "doküman"]),
            ("sigorta", ["sigorta", "sgk"]),
            ("başlangıç", ["başlangıç", "başlat", "ne zaman", "kesinleşti", "tarih"])
        ],
        "ödev": [
            ("sistem", ["hata", "yüklenmiyor", "sistem", "görünmüyor"]),
            ("geç teslim", ["geç", "yetişemedim", "uzatma", "süre", "geciktim"]),
            ("format", ["pdf", "format", "dosya türü", "biçim"]),
            ("grup", ["grup", "arkadaşım", "tek başıma", "katılmadı", "proje", "projeye"]),
            ("son teslim", ["son teslim", "teslim tarihi", "ne zaman teslim"])
        ],
        "sınav": [
            ("ne zaman", ["ne zaman", "açıklanacak", "yayınlandı", "sonuç"]),
            ("iptal", ["iptal", "olmadı", "yapılmadı", "ertelendi"]),
            ("sınav yeri", ["yer", "salon", "hangi sınıf", "nerede"]),
            ("cevap anahtarı", ["cevap anahtarı", "doğru cevap", "puanlama"]),
            ("mazeret", ["mazeret", "rapor", "katılamadım"]),
            ("not", ["not", "puan", "harf notu", "puanım", "aa", "bb", "cc", "düşük not", "yüksek not", "b1", "notum","sonuç"]),
            ("kağıt", ["kağıt", "incelemek", "görmek", "cevap kağıdı", "sınav kağıdı", "itiraz"])
        ],
        "toplantı": [
            ("danışmanlık", ["danışmanlık", "saat", "randevu"]),
            ("tez", ["tez", "ön savunma", "jüri"]),
            ("sunum", ["sunum", "araştırma toplantısı"])
        ],
        "ders": [
            ("çakışma", ["çakışma", "aynı saat", "üst üste"]),
            ("erişim", ["OBS", "erişim", "giremiyorum","obs"]),
            ("yüz yüze", ["yüz yüze", "online", "çevrimiçi"])
        ],
        "etkinlik": [
            ("katılım", ["katılım zorunlu", "zorunlu mu", "katılmak gerekli mi"]),
            ("mezuniyet", ["mezunlar günü", "mezuniyet etkinliği"]),
            ("katılım belgesi", ["katılım belgesi", "sertifika"]),
            ("panel", ["panel", "poster", "kayıt", "katılmak"])
        ],
        "izin": [
            ("rapor", ["rapor", "sağlık"]),
            ("ailevi", ["ailevi", "ailevi neden"]),
            ("yurtdışı", ["yurt dışı", "görev", "konferans"])
        ],
        "işbirliği": [
            ("tübitak", ["tübitak", "proje"]),
            ("konferans", ["konferans", "bildiri"]),
            ("veri seti", ["veri seti", "dataset"])
        ],
        "tavsiye": [
            ("yurt dışı", ["yurt dışı", "erasmus"]),
            ("tübitak", ["tübitak", "burs"]),
            ("lisansüstü", ["lisansüstü", "yüksek lisans"])
        ],
        "kütüphane": [
            ("uzatma", ["uzatma", "süre"]),
            ("ceza", ["ceza", "geç kaldım"]),
            ("rezerv", ["rezerv", "ayırttım"])
        ],
        "burs": [
            ("başvuru", ["başvuru", "başvurmak"]),
            ("form", ["form", "belge"]),
            ("sonuç", ["sonuç", "açıklandı"])
        ],
        "yaz okulu": [
            ("ders açılma", ["ders açılacak mı", "hangi ders", "açılacak", "açılması"]),
            ("ücret", ["ücret", "fiyat", "ne kadar", "ücretleri"]),
            ("başvuru", ["başvuru", "kayıt", "ne zaman", "başlayacak"]),
            ("çakışma", ["çakışma", "aynı saat", "üst üste", "çakışıyor"])
        ]
    }

    text_lower = text.lower()
    cat_responses = responses.get(category, {})

    if category in keyword_map:
        for sub_key, keywords in keyword_map[category]:
            if any(kw in text_lower for kw in keywords):
                return cat_responses.get(sub_key)
        return cat_responses.get("default")

    if category == "diğer":
        return "Bu e-posta için hazır bir yanıt bulunmamaktadır. Lütfen kendiniz uygun bir yanıt giriniz."

    return f"{category} kategorisi için otomatik yanıt tanımlı değil."


def prioritize_email(category):
    priority_map = {
        "staj": "Yüksek",
        "sınav": "Yüksek",
        "ödev": "Orta",
        "izin": "Orta",
        "burs": "Orta",
        "toplantı": "Orta",
        "yaz okulu": "Düşük",
        "etkinlik": "Düşük",
        "işbirliği": "Düşük",
        "tavsiye": "Düşük",
        "kütüphane": "Düşük",
        "ders": "Orta"
    }
    return priority_map.get(category, "Düşük")

def process_single_email(konu, icerik):
    temiz_icerik = clean_duplicate_subject(konu, icerik)
    kategori = categorize_email(temiz_icerik, konu)

    # Özetleme için sadece orijinal içerik kullanılsın
    if len(icerik) > 50:
        özet = summarize_email(icerik.strip())
    else:
        özet = icerik.strip()


    if özet.lower().startswith("konu: "):
        özet = özet.split("Konu: ", 1)[-1].strip()

    yanıt = suggest_response(kategori, özet)
    öncelik = prioritize_email(kategori)

    return {
        "kategori": kategori,
        "özet": özet,
        "yanıt": yanıt,
        "öncelik": öncelik
    }
def clean_duplicate_subject(konu, icerik):
    if not konu or not icerik:
        return icerik

    import re
    def normalize(text):
        return re.sub(r'[^\w\s]', '', text.lower().strip())

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


