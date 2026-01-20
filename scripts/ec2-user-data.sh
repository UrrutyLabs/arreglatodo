#!/bin/bash
set -euo pipefail

log() { echo "[user-data] $1"; }

log "Updating system..."
yum update -y

log "Installing base utilities (no curl install)..."
yum install -y git unzip

log "Installing Node.js 24..."
curl -fsSL https://rpm.nodesource.com/setup_24.x | bash -
yum install -y nodejs

log "Node installed:"
node -v
npm -v

# ✅ Must be root (writes to /usr/bin)
log "Enabling corepack globally..."
corepack enable

# ✅ Then activate pnpm for ec2-user
log "Preparing pnpm for ec2-user..."
sudo -u ec2-user -i bash <<'EOF'
set -euo pipefail
corepack prepare pnpm@latest --activate
pnpm -v
EOF

log "Installing pm2..."
npm install -g pm2

log "Installing nginx (not started)..."
yum install -y nginx
systemctl enable nginx

log "Bootstrap completed (no apps started)."
