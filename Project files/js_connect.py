import sys, pickle, pandas as pd, numpy as np  

data = sys.argv

model = pickle.load(open('/Users/indrashekarg/Documents/Education docs/Cars365/Project files/cars365_predictor.pkl', 'rb'))

pred_value = model.predict(pd.DataFrame(columns=['car_name', 'brand', 'km_driven'], data=np.array(data[1:]).reshape(1, 3)))[0]
pred_value = (np.round(pred_value) // 100000) * 100000

print(pred_value)
