function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var folderId = "1nIJoKj4bOTGkhhuWJ7SX5JGEVMldWgEt"; // Change this to your folder ID
    var folder = DriveApp.getFolderById(folderId);

    var imageUrl = "No Image"; // Default if no image is uploaded

    if (e.postData && e.postData.contents) {
      var data = JSON.parse(e.postData.contents); // Parse JSON request body

      if (data.image) {
        var blob = Utilities.newBlob(Utilities.base64Decode(data.image), "image/png", "uploaded_image.png");
        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
        imageUrl = "https://lh3.googleusercontent.com/d/" + file.getId() + "=w500-h500";
      }

      // Append product data to Google Sheet
      sheet.appendRow([
        new Date(), // Timestamp
        data.title || "No Title",
        data.description || "No Description",
        data.category || "No Category",
        data.size || "No Size",
        data.price || "No Price",
        imageUrl // Store image URL
      ]);

      return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    }

    return ContentService.createTextOutput("Error: No data received").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
