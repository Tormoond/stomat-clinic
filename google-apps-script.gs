/**
 * Website leads → Google Sheet
 * 1) Create a Google Sheet. Extensions → Apps Script, paste this code.
 * 2) Deploy → New deployment → type "Web app":
 *    Execute as: Me;  Who has access: Anyone → Deploy, confirm the permissions.
 * 3) Copy the web app URL (ending in /exec) and paste it into the
 *    ENDPOINT variable in the website's HTML file.
 * After changing the code, use Deploy → Manage deployments → New version.
 */
var SHEET_NAME = 'Leads';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(['Date', 'Name', 'Phone', 'Email', 'Contact method', 'Comment', 'Page']);
      sh.setFrozenRows(1);
    }
    sh.appendRow([new Date(), d.name, "'" + d.phone, d.email, d.channel, d.message, d.page]);
    return ContentService.createTextOutput(JSON.stringify({ok: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok: false, error: String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
