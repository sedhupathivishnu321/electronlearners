#!/usr/bin/env bash
# One-time setup of a fresh Ubuntu VM (Oracle Cloud Always Free, Google Cloud, any VPS) for the JR Learners API.
# Run on the VM:   curl -fsSL https://raw.githubusercontent.com/sedhupathivishnu321/electronlearners/main/deploy/setup-vm.sh | sudo bash
set -euo pipefail

echo ">> installing Docker"
apt-get update -y
apt-get install -y ca-certificates curl git
if ! command -v docker >/dev/null; then curl -fsSL https://get.docker.com | sh; fi
systemctl enable --now docker

echo ">> opening ports 80 and 443 in the VM firewall"
if command -v ufw >/dev/null && ufw status | grep -q active; then ufw allow 80/tcp; ufw allow 443/tcp; fi
# Oracle Ubuntu images ship iptables rules that block everything except SSH
if iptables -S INPUT 2>/dev/null | grep -q "REJECT"; then
  iptables -I INPUT 5 -p tcp --dport 80 -j ACCEPT
  iptables -I INPUT 5 -p tcp --dport 443 -j ACCEPT
  command -v netfilter-persistent >/dev/null || DEBIAN_FRONTEND=noninteractive apt-get install -y iptables-persistent
  netfilter-persistent save || true
fi

echo ">> letting the deploy user run docker"
U="${SUDO_USER:-ubuntu}"
usermod -aG docker "$U" || true
mkdir -p "/home/$U/jrlearners" && chown "$U:$U" "/home/$U/jrlearners"

echo
echo "VM is ready. Next: add the GitHub secrets / variables, then push to main (or run the 'Deploy API to server' workflow)."
