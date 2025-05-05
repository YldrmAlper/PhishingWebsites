import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

# ARFF dosyasını okuma fonksiyonu
def read_arff(file_path):
    features = []
    data = []
    with open(file_path, 'r') as file:
        reading_data = False
        for line in file:
            line = line.strip()
            if line.startswith('@attribute'):
                # Özellik adını al
                feature_name = line.split()[1]
                features.append(feature_name)
            elif line.startswith('@data'):
                reading_data = True
                continue
            elif reading_data and line and not line.startswith('%'):
                # Veri satırını al
                data.append(line.split(','))
    
    # Özellikler listesinden 'Result' özelliğini çıkar (son özellik)
    features = features[:-1]
    
    # Veri çerçevesini oluştur
    X = []
    y = []
    for row in data:
        X.append([int(val) for val in row[:-1]])
        y.append(int(row[-1]))
    
    return np.array(X), np.array(y), features

def train_model():
    # Veri setini oku
    X, y, features = read_arff('Training Dataset.arff')
    
    # Veriyi eğitim ve test kümelerine ayır
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # RandomForest sınıflandırıcısını oluştur ve eğit
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Test verileri ile modeli değerlendir
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)
    
    print(f"Model Doğruluğu: {accuracy:.4f}")
    print("Sınıflandırma Raporu:")
    print(report)
    
    # Modeli kaydet
    if not os.path.exists('model'):
        os.makedirs('model')
    with open('model/phishing_model.pkl', 'wb') as file:
        pickle.dump(model, file)
    
    # Özellikleri de kaydet
    with open('model/features.pkl', 'wb') as file:
        pickle.dump(features, file)
    
    return model, features

if __name__ == "__main__":
    train_model() 