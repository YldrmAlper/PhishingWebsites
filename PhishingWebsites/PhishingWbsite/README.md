# URL Oltalama Tespit Sistemi

Bu proje, makine öğrenimi kullanarak URL'lerin oltalama (phishing) sitesi olup olmadığını tespit eden bir web uygulamasıdır.

## Özellikler

- URL analizi için 30 farklı özellik çıkarma
- Random Forest algoritması ile makine öğrenimi modeli
- Kullanıcı dostu web arayüzü
- Gerçek zamanlı URL analizi
- Detaylı sonuç gösterimi

## Kurulum

1. Gereksinimleri yükleyin:
   ```
   pip install -r requirements.txt
   ```

2. Modeli eğitin (ilk çalıştırmada otomatik olarak gerçekleşir)
   ```
   python model.py
   ```

3. Uygulamayı başlatın:
   ```
   python app.py
   ```

4. Tarayıcınızda [http://localhost:5000](http://localhost:5000) adresine gidin.
