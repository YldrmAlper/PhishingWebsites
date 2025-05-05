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

## Kullanım

1. Web arayüzündeki metin kutusuna kontrol etmek istediğiniz URL'yi girin.
2. "Kontrol Et" düğmesine tıklayın.
3. Sistem URL'yi analiz edecek ve sonucu gösterecektir.

## Veri Seti

Bu projede kullanılan veri seti, oltalama ve meşru URL'lerin çeşitli özelliklerini içermektedir. Veri seti 30 farklı özellik içerir ve her URL için "oltalama" veya "meşru" etiketleri bulunur.

## Teknik Detaylar

- **Backend**: Flask web çerçevesi
- **Makine Öğrenimi**: Scikit-learn kütüphanesi, Random Forest algoritması
- **Frontend**: HTML, CSS, JavaScript
- **URL Analizi**: Python'un urllib, requests, BeautifulSoup kütüphaneleri 