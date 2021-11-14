import pymongo
 
 
client = pymongo.MongoClient("mongodb+srv://sanjaim:test123@cluster0.q5nsn.mongodb.net/student_data?retryWrites=true&w=majority")
db = client["student_data"]
col = db["cse"]
 
col.update_one({'name':'Sanjai M'}, {'$set' : {'rollno': '41'}})

print(col.find_one())