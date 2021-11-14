import pickle, pandas as pd, numpy as np  
import pymongo

model = pickle.load(open('cars365_predictor.pkl', 'rb'))

client = pymongo.MongoClient("DB_Host_Link")
db = client["Cars365DB"]
col = db["cardetails"]
 
data = col.find()

for element in data:
    carname = element['carname']
    brand = element['carcompany']
    km_driven = element['totalkmdriven']

    pred_value = model.predict(pd.DataFrame(columns=['car_name', 'brand', 'km_driven'], data=np.array([carname, brand, km_driven]).reshape(1, 3)))[0]
    pred_value = int((np.round(pred_value) // 100000) * 100000)

    col.update_one({'carname':carname}, {'$set' : {'predictedprice': pred_value}})


