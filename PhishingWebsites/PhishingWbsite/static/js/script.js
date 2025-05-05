document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const checkButton = document.getElementById('check-button');
    const loadingSpinner = document.getElementById('loading-spinner');
    const loadingText = document.getElementById('loading-text');
    const resultContainer = document.getElementById('result-container');
    const safeIcon = document.getElementById('safe-icon');
    const unsafeIcon = document.getElementById('unsafe-icon');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const checkedUrl = document.getElementById('checked-url');
    
    // Adımlar
    const steps = document.querySelectorAll('.step');
    
    // URL kontrolü için olay dinleyicisi
    checkButton.addEventListener('click', () => {
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Lütfen bir URL girin');
            return;
        }
        
        // URL formatını düzelt
        let formattedUrl = url;
        if (!(url.startsWith('http://') || url.startsWith('https://'))) {
            formattedUrl = 'http://' + url;
            console.log('URL düzeltildi:', formattedUrl);
        }
        
        // Analiz başlat
        analyzeUrl(formattedUrl);
    });
    
    // Enter tuşu ile form gönderme
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkButton.click();
        }
    });
    
    // Adımları göster ve ilerlet
    function updateLoadingSteps() {
        // Tüm adımları temizle
        steps.forEach(step => {
            step.classList.remove('active');
            step.classList.remove('completed');
        });
        
        // İlk adımı aktif yap
        steps[0].classList.add('active');
        
        // Adımları sırayla gösterme
        let currentStep = 0;
        
        const interval = setInterval(() => {
            // Aktif adımı tamamlandı olarak işaretle
            steps[currentStep].classList.remove('active');
            steps[currentStep].classList.add('completed');
            
            // Sonraki adıma geç
            currentStep++;
            
            // Tüm adımlar tamamlandıysa, interval'ı durdur
            if (currentStep >= steps.length) {
                clearInterval(interval);
                return;
            }
            
            // Yeni adımı aktif yap
            steps[currentStep].classList.add('active');
            
            // Yükleme mesajını güncelle
            switch (currentStep) {
                case 1:
                    loadingText.textContent = "Güvenlik kontrolleri yapılıyor...";
                    break;
                case 2:
                    loadingText.textContent = "Sayfa içeriği analiz ediliyor...";
                    break;
                case 3:
                    loadingText.textContent = "Makine öğrenimi modeli çalıştırılıyor...";
                    break;
            }
        }, 1500);
        
        return interval;
    }
    
    // URL'yi kontrol et ve sonucu göster
    async function analyzeUrl(url) {
        // UI öğelerini güncelle
        loadingSpinner.style.display = 'block';
        resultContainer.style.display = 'none';
        checkButton.disabled = true;
        loadingText.textContent = "URL analizi başlatılıyor...";
        
        // Adımları göster
        const stepsInterval = updateLoadingSteps();
        
        try {
            console.log('Analiz ediliyor:', url);
            
            // API'ye istek gönder
            const response = await fetch('/api/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'API isteği başarısız oldu');
            }
            
            // Sonucu göster
            displayResult(data);
        } catch (error) {
            console.error('Hata:', error);
            
            // Hata mesajını göster
            resultContainer.style.display = 'block';
            safeIcon.classList.add('hidden');
            unsafeIcon.classList.add('hidden');
            resultTitle.textContent = 'Hata Oluştu';
            resultTitle.style.color = '#e67e22';
            resultDescription.textContent = `URL analiz edilirken bir hata oluştu: ${error.message}. Lütfen başka bir URL deneyin veya daha sonra tekrar deneyin.`;
            checkedUrl.textContent = url;
        } finally {
            // Loading spinner'ı gizle ve düğmeyi etkinleştir
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
                checkButton.disabled = false;
                clearInterval(stepsInterval);
            }, 500);
        }
    }
    
    // Sonucu görüntüle
    function displayResult(data) {
        const { url, is_phishing } = data;
        
        // URL'yi göster
        checkedUrl.textContent = url;
        
        // İkon ve metin güncelleme
        if (is_phishing) {
            safeIcon.classList.add('hidden');
            unsafeIcon.classList.remove('hidden');
            resultTitle.textContent = 'Tehlikeli URL Tespit Edildi!';
            resultTitle.style.color = 'var(--danger-color)';
            resultDescription.textContent = 'Bu URL muhtemelen bir oltalama (phishing) sitesidir. Kişisel bilgilerinizi girmemenizi ve bu siteyi ziyaret etmemenizi öneririz.';
        } else {
            unsafeIcon.classList.add('hidden');
            safeIcon.classList.remove('hidden');
            resultTitle.textContent = 'Güvenli URL';
            resultTitle.style.color = 'var(--success-color)';
            resultDescription.textContent = 'Bu URL güvenli görünüyor. Ancak yine de internette gezinirken dikkatli olun.';
        }
        
        // Sonuç container'ını göster
        resultContainer.style.display = 'block';
        
        // Sayfa konumunu sonuca kaydır
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }
}); 