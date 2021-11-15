function importMongodb() {
  var sheet1 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  sheet1.clear();
  sheet1.appendRow([
    "object_id",
    "owner_name",
    "car_company",
    "car_name",
    "selling_price",
    "predicted_price",
    "total_km_driven",
    "location",
    "purpose",
  ]);
  var getData = UrlFetchApp.fetch(
    "https://ap-south-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/google_sheets_connect-vsjdj/service/GoogleSheetsConnect/incoming_webhook/webhook0"
  ).getContentText();
  var data = JSON.parse(getData);
  for (var i = 0; i < data.length; i++) {
    sheet1.getRange(i + 2, 1).setValue(data[i]._id.$oid);
    sheet1.getRange(i + 2, 2).setValue(data[i].name);
    sheet1.getRange(i + 2, 3).setValue(data[i].carcompany);
    sheet1.getRange(i + 2, 4).setValue(data[i].carname);
    sheet1.getRange(i + 2, 5).setValue(data[i].sellingprice.$numberInt);
    sheet1.getRange(i + 2, 6).setValue(data[i].predictedprice);
    sheet1.getRange(i + 2, 7).setValue(data[i].totalkmdriven.$numberInt);
    sheet1.getRange(i + 2, 8).setValue(data[i].location);
    sheet1.getRange(i + 2, 9).setValue(data[i].purpose);
  }
}
