import React, { useState } from 'react';

function GmailForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adet, setAdet] = useState(20);
  const [mailler, setMailler] = useState([]);
  const [girisBasarili, setGirisBasarili] = useState(false);
  const [girisSonuc, setGirisSonuc] = useState(""); // "" | "başarılı" | "hata"
  const [girisMesaj, setGirisMesaj] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tabloGorunur, setTabloGorunur] = useState(true);
  const [analizSonuclari, setAnalizSonuclari] = useState([]);
  const [yanitSonuc, setYanitSonuc] = useState({ mesaj: "", tip: "", index: null }); // tip: "basari" | "hata"

  // Giriş Fonksiyonu
  const handleLogin = async (e) => {
    e.preventDefault();
    setGirisSonuc("");
    setGirisMesaj("");
    setMailler([]);
    setAnalizSonuclari([]);
    const girisResponse = await fetch('http://localhost:5000/gmail-giris', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const girisData = await girisResponse.json();
    if (girisResponse.ok) {
      setGirisSonuc("başarılı");
      setGirisMesaj("Giriş başarılı!");
      setGirisBasarili(true);
    } else {
      setGirisSonuc("hata");
      setGirisMesaj(girisData.error || "Giriş başarısız!");
    }
  };

  // E-postaları Getir Fonksiyonu
  const handleGetEmails = async () => {
    const alResponse = await fetch('http://localhost:5000/eposta-al', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, adet })
    });
    const alData = await alResponse.json();
    if (alResponse.ok) {
      setMailler(alData.emails.map(m => ({ ...m, acik: false })));
      setTabloGorunur(true);
      setAnalizSonuclari([]);
    } else {
      alert(`❌ Alım Hatası: ${alData.error}`);
    }
  };

  // Analiz Fonksiyonu
  const handleAnalizEt = async () => {
    const response = await fetch('http://localhost:5000/eposta-analiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails: mailler })
    });
    const data = await response.json();
    setAnalizSonuclari(data.analizler);
  };

  // Otomatik yanıtı güncelleme (kullanıcı elle değiştirirse)
  const handleYanıtChange = (idx, yeniYanit) => {
    setAnalizSonuclari(prev =>
      prev.map((s, i) => i === idx ? { ...s, yanıt: yeniYanit } : s)
    );
  };

  // Otomatik yanıtı gönderme
  const handleYanitGonder = async (idx) => {
  // Gönderen, şifre ve mail bilgilerini uygun şekilde al
    const aliciMail = mailler[idx]?.from; // gelen e-posta adresi
    const konu = mailler[idx]?.subject || "Yanıtınız";
    const mesaj = analizSonuclari[idx].yanıt;

    try {
      const response = await fetch('http://localhost:5000/gmail-yanit-gonder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gonderen: email,
          sifre: password,
          alici: aliciMail,
          konu: konu,
          mesaj: mesaj
        })
      });
      const data = await response.json();
      if (data.success) {
        setYanitSonuc({ mesaj: " Yanıt başarıyla gönderildi.", tip: "basari", index: idx });
      } else {
        setYanitSonuc({ mesaj: `Yanıt gönderilemedi: ${data.error || "Bilinmeyen hata."}`, tip: "hata", index: idx });
      }
    } catch (err) {
      setYanitSonuc({ mesaj: ` Sunucu hatası: ${err.message}`, tip: "hata" });
    }
    // Mesajı 4 saniye sonra otomatik silmek için:
    setTimeout(() => setYanitSonuc({ mesaj: "", tip: "" }), 4000);
  };

  function getSenderName(from) {
  // "Zeynep HACISALİHOĞLU <mail@adres.com>" veya "=?UTF-8?...?= <mail@adres.com>" gibi ise sadece mail adresini döndür
    const match = from.match(/<([^>]+)>/);
    return match ? match[1].trim() : from;
  }

  return (
    <div>
      {/* Bilgi kutusu */}
      {girisSonuc === "başarılı" && (
        <div className="bilgi-kutusu basarili"> {girisMesaj}</div>
      )}
      {girisSonuc === "hata" && (
        <div className="bilgi-kutusu hata"> {girisMesaj}</div>
      )}

      {/* Giriş Formu */}
      {!girisBasarili && (
        <form onSubmit={handleLogin} className="form-box">
          <h3>Gmail Girişi</h3>
          <input
            type="email"
            className="input-box"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div style={{ position: 'relative', width: '90%', maxWidth: 360, margin: "0 auto 14px auto" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="input-box"
              placeholder="Uygulama şifresi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", marginBottom: 0 }}
            />
            <button
              type="button"
              style={{
                position: 'absolute', right: 12, top: 13, background: 'none', border: 'none',
                cursor: 'pointer', color: '#274583', fontWeight: 600, fontSize: 15
              }}
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
            >
              {showPassword ? "Gizle" : "Göster"}
            </button>
          </div>
          <button type="submit" className="main-button">Giriş Yap</button>
        </form>
      )}

      {/* Giriş başarılıysa: Slider ve E-posta Getir */}
      {girisBasarili && (
        <div style={{ marginTop: 32, marginBottom: 24 }}>
          <label style={{ fontWeight: 500, fontSize: "1.05rem", color: "#031d52" }}>
            Kaç e-posta getirilsin?
            <span style={{ marginLeft: 14, fontWeight: "bold", fontSize: "1.15rem", color: "#003169" }}>{adet}</span>
          </label>
          <input
            type="range"
            min={1}
            max={150}
            value={adet}
            onChange={(e) => setAdet(Number(e.target.value))}
            className="custom-slider"
            style={{ width: "90%", marginTop: 18, marginBottom: 24 }}
          />
          <button className="main-button" style={{ width: "300px" }} onClick={handleGetEmails}>
            E-mailleri Getir
          </button>
        </div>
      )}

      {/* Mailler tablosu */}
      {mailler.length > 0 && (
        <div className="mail-list">
          <h4 style={{
            fontSize: "1.18rem", color: "#031d52", marginBottom: "6px", marginTop: "30px",
            fontWeight: 700, letterSpacing: "0.02em",
          }}>
            Son {adet} E-Posta
          </h4>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button
              className="detay-button"
              style={{
                padding: "7px 20px", fontSize: "0.98em",
                background: tabloGorunur ? "#e8f5e9" : "#e3e8f7",
                color: "#003169", border: "none", borderRadius: "10px",
                fontWeight: "600", marginRight: "8px", minWidth: 140
              }}
              onClick={() => setTabloGorunur(!tabloGorunur)}
            >
              {tabloGorunur ? "Tabloyu Gizle" : "Tabloyu Göster"}
            </button>
            <button
              className="main-button"
              style={{ width: 180, padding: "12px 0", margin: 0, fontSize: "1.05em" }}
              onClick={handleAnalizEt}
              disabled={mailler.length === 0}
            >
              E-Postaları İşle
            </button>
          </div>
          {tabloGorunur && (
            <div className="table-responsive">
              <table className="mail-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Konu</th>
                    <th>Gönderen</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {mailler.map((mail, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td style={{ textAlign: "center", fontWeight: 600 }}>{i + 1}</td>
                        <td style={{
                          maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                        }}>
                          {mail.subject}
                        </td>
                        <td style={{
                          maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                        }}>
                          {getSenderName(mail.from)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="detay-button"
                            onClick={() =>
                              setMailler(mailler =>
                                mailler.map((m, idx) =>
                                  idx === i ? { ...m, acik: !m.acik } : m
                                )
                              )
                            }
                          >
                            {mail.acik ? "Gizle" : "Detay"}
                          </button>
                        </td>
                      </tr>
                      {mail.acik && (
                        <tr>
                          <td colSpan={4}>
                            <div className="detay-icerik">{mail.body}</div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Analiz Sonuçları */}
      {analizSonuclari.length > 0 && (
        <div>
          <h2 style={{ textAlign: "center", marginTop: 38, marginBottom: 18 }}>Analiz Sonuçları</h2>
          {analizSonuclari.map((sonuc, i) => (
            <div
              key={i}
              style={{
                margin: "32px auto",
                background: "#f7faff",
                borderRadius: 18,
                boxShadow: "0 8px 30px rgba(45, 105, 152, 0.12)",
                maxWidth: 640,
                padding: 32,
                position: "relative"
              }}
            >
              {/* Kategori badge */}
              <div style={{
                position: "absolute",
                left: 26,
                top: 22,
                fontWeight: 700,
                color: "#175fc9",
                fontSize: "1.11em",
                letterSpacing: ".03em",
                background: "#e8f4ff",
                padding: "6px 20px",
                borderRadius: 11,
                boxShadow: "0 2px 8px #b2d4fb23"
              }}>
                {sonuc.kategori}
              </div>
              <div style={{ fontWeight: 700, fontSize: 21, marginBottom: 18, marginTop: 8, color: "#1b2742", textAlign: "center" }}>
                {i + 1}. Mail
              </div>
              {/* Özet */}
              <div
                style={{
                  background: "#f0f5ff",
                  borderRadius: 8,
                  padding: "16px 20px",
                  fontWeight: 500,
                  fontSize: "1.09em",
                  color: "#222",
                  width: "100%",
                  boxSizing: "border-box",
                  textAlign: "left",
                  marginBottom: 10,
                  whiteSpace: "pre-line",
                  fontFamily: "inherit" // textarea ile aynı font
                }}
              >
                {sonuc.özet || "-"}
              </div>
              {/* Otomatik Yanıt */}
              <textarea
                value={sonuc.yanıt || ""}
                className="input-box"
                style={{
                  background: "#f0f5ff",
                  borderRadius: 8,
                  padding: "16px 20px",
                  fontWeight: 500,
                  fontSize: "1.09em",
                  color: "#222",
                  width: "100%",
                  boxSizing: "border-box",
                  textAlign: "left",
                  marginBottom: 0,
                  minHeight: 90,
                  resize: "vertical", // Kullanıcı yükseklik değiştirebilir
                  border: "1.5px solid #b2c7e6", // Hafif border
                  fontFamily: "inherit",
                  display: "block",
                  overflow: "hidden", // Kaydırma çubuğu olmasın
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#175fc9"}
                onBlur={e => e.target.style.borderColor = "#b2c7e6"}
                onChange={e => handleYanıtChange(i, e.target.value)}
                rows={Math.max(3, (sonuc.yanıt || "").split('\n').length)}
              />
              <div style={{ textAlign: "right", marginTop: 14 }}>
                <button
                  className="main-button"
                  style={{ width: 165, padding: "12px 15px", fontSize: "1em", margin: 0 }}
                  onClick={() => handleYanitGonder(i)}
                  type="button"
                >
                  Yanıtı Gönder
                </button>
              </div>
              {yanitSonuc.mesaj && yanitSonuc.index === i && (
                <div
                  className={`bilgi-kutusu ${yanitSonuc.tip === "basari" ? "basarili" : "hata"}`}
                  style={{ maxWidth: 440, margin: "18px auto 0 auto" }}
                >
                  {yanitSonuc.mesaj}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Yanıt Sonuç Kutusu */}
      {yanitSonuc.mesaj && (
        <div
          className={`bilgi-kutusu ${yanitSonuc.tip === "basari" ? "basarili" : "hata"}`}
          style={{ maxWidth: 440, margin: "20px auto 0 auto" }}
        >
          {yanitSonuc.mesaj}
        </div>
      )
      }
    </div>
  );
}

export default GmailForm;
