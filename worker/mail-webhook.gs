// Google Apps Script: sends the shop's e-mails as the Google account that owns the script (help.jrlearners@gmail.com).
// Setup (2 minutes), signed in as help.jrlearners@gmail.com:
//  1. Go to https://script.google.com -> New project -> paste this whole file -> Save.
//  2. Project Settings (gear) -> Script properties -> Add: name SECRET, value = the MAIL_WEBHOOK_SECRET you were given.
//  3. Deploy -> New deployment -> type "Web app" -> Execute as: Me -> Who has access: Anyone -> Deploy -> authorise when asked.
//  4. Copy the "Web app" URL (ends with /exec) and save it as the GitHub secret MAIL_WEBHOOK_URL.
// Free Gmail accounts can send about 100 mails per day this way.
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || d.secret !== secret) return out({ ok: false, error: 'forbidden' });
    if (!d.to || !d.subject || !d.body) return out({ ok: false, error: 'missing fields' });
    MailApp.sendEmail({ to: d.to, subject: d.subject, body: d.body, name: 'JR Learners', replyTo: 'help.jrlearners@gmail.com' });
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
