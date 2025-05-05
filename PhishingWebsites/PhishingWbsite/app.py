from flask import Flask, request, jsonify, render_template
import pickle
import os
import numpy as np
import traceback
from feature_extractor import extract_features

app = Flask(__name__)

# NumPy tiplerini Python tiplerine dönüştürme yardımcı fonksiyonu
def convert_numpy_types(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.bool_):
        return bool(obj)
    else:
        return obj

# Model ve özelliklerin yüklenmesi
def load_model():
    model_path = 'model/phishing_model.pkl'
    features_path = 'model/features.pkl'
    
    if not os.path.exists(model_path) or not os.path.exists(features_path):
        # Model dosyaları yoksa, modeli eğit
        from model import train_model
        model, features = train_model()
        return model, features
    
    # Model dosyaları varsa, doğrudan yükle
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
    
    with open(features_path, 'rb') as file:
        features = pickle.load(file)
    
    return model, features

try:
    model, features = load_model()
    print("Model başarıyla yüklendi")
except Exception as e:
    print(f"Model yükleme hatası: {e}")
    print(traceback.format_exc())

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/check', methods=['POST'])
def check_url():
    data = request.get_json()
    url = data.get('url', '')
    
    if not url:
        return jsonify({'error': 'URL gerekli'}), 400
    
    try:
        print(f"URL kontrol ediliyor: {url}")
        
        # URL'den özellikleri çıkar
        url_features = extract_features(url)
        print(f"URL özellikleri çıkarıldı: {url}")
        
        # Modeli kullanarak tahmin yap
        prediction = model.predict([url_features])[0]
        probability = model.predict_proba([url_features])[0]
        
        # NumPy tiplerini Python tiplerine dönüştür
        prediction_py = convert_numpy_types(prediction)
        max_prob = float(max(probability)) * 100
        
        # Sonuçları hazırla (1: meşru, -1: oltalama)
        result = {
            'url': url,
            'is_phishing': prediction_py == -1,
            'confidence': max_prob
        }
        
        print(f"Sonuç: {result}")
        return jsonify(result)
    
    except Exception as e:
        error_msg = f"URL analizi sırasında hata: {str(e)}"
        print(error_msg)
        print(traceback.format_exc())
        return jsonify({'error': error_msg}), 500

if __name__ == '__main__':
    app.run(debug=True) 