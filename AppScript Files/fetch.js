function doGet() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues(); // Get all data
    
    var products = [];
    for (var i = 1; i < data.length; i++) { // Start from row 2 (skip headers)
      products.push({
        timestamp: data[i][0],
        title: data[i][1],
        description: data[i][2],
        category: data[i][3],
        size: data[i][4],
        price: data[i][5],
        image: data[i][6]  // Make sure the image URL is public
      });
    }

    return ContentService.createTextOutput(JSON.stringify(products))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
