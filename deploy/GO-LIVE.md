# Going live on a free cloud VM

You do this once (about 30 minutes). Afterwards GitHub deploys the API by itself on every push.

## 1. Create the VM (Oracle Cloud Always Free)
1. Sign up at https://www.oracle.com/cloud/free/ (a card is needed only to verify you; Always Free resources are not charged).
2. Compute -> Instances -> **Create instance**. Image: **Ubuntu 22.04**. Shape: **VM.Standard.E2.1.Micro** (Always Free) or the free Ampere A1. Under *Add SSH keys* choose **Generate a key pair** and **download the private key** (keep it safe).
3. After it starts, note the **public IP address**.
4. Open the ports: Networking -> your VCN -> Security Lists -> Default -> **Add ingress rules**: source `0.0.0.0/0`, TCP, destination ports `80` and `443`.

(Google Cloud alternative: Compute Engine -> e2-micro in us-west1/us-central1/us-east1, Ubuntu 22.04, tick "Allow HTTP" and "Allow HTTPS".)

## 2. Point a name at it
In the place where jrlearners.com's DNS is managed, add an **A record**: name `api`, value = the VM's public IP. (Result: api.jrlearners.com.) Wait a few minutes.

## 3. Prepare the VM (one command)
Connect with the downloaded key: `ssh -i <key-file> ubuntu@<public-ip>`, then run:

    curl -fsSL https://raw.githubusercontent.com/sedhupathivishnu321/electronlearners/main/deploy/setup-vm.sh | sudo bash

## 4. Tell GitHub about the server
Repository -> Settings -> Secrets and variables -> Actions:

| Kind | Name | Value |
|---|---|---|
| Secret | `SSH_HOST` | the VM's public IP |
| Secret | `SSH_USER` | `ubuntu` |
| Secret | `SSH_KEY` | the full text of the private key file you downloaded |
| Secret | `ADMIN_EMAIL` | the e-mail you will use for the admin account |
| Secret | `ADMIN_PASSWORD` | a strong password (8+ characters with a digit) |
| Variable | `API_DOMAIN` | `api.jrlearners.com` |
| Variable | `API_URL` | `https://api.jrlearners.com` |

(The PayU, mail and signing-key secrets are already set. `SMTP_PASSWORD` must be a Google **App Password**, see below.)

## 5. Deploy
Actions tab -> **Deploy API to server** -> Run workflow. Then re-run **Deploy JR Learners to GitHub Pages** so the site learns the API address (`API_URL`).
Check: https://api.jrlearners.com/health returns `{"status":"ok"}`.

## Gmail App Password (for the mail to admin@jrlearners.com)
Gmail refuses normal passwords for apps. In the Google account of help.jrlearners@gmail.com turn on 2-Step Verification, then create an App Password at https://myaccount.google.com/apppasswords and save it as the `SMTP_PASSWORD` secret. Run the **Send a test e-mail** workflow to confirm.

## Back-ups
The database is in the Docker volume `app_data`. Back it up now and then:
`docker run --rm -v jrlearners_app_data:/data -v $PWD:/out alpine tar czf /out/jrlearners-data.tgz /data`
