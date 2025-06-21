# 🔒 Air-Gapped Healthcare AI Deployment Guide

## 🎯 **Overview**

This guide provides step-by-step instructions for deploying the AI-Powered MCP Server in completely air-gapped healthcare environments where internet connectivity is restricted or prohibited for security and compliance reasons.

## 🏥 **Why Air-Gapped Deployment for Healthcare?**

### **Maximum Security & Compliance**
- ✅ **Zero external network access** - Complete isolation from internet threats
- ✅ **HIPAA/HITECH compliance** - Patient data never leaves secure environment
- ✅ **Government/Military grade security** - Meets highest security standards
- ✅ **Audit compliance** - No external data transmission to audit
- ✅ **Ransomware protection** - Isolated from external attack vectors

### **Regulatory Requirements**
- **HIPAA**: Required for certain high-security healthcare environments
- **HITECH**: Enhanced security for electronic health information
- **SOX**: Financial compliance for healthcare organizations
- **Government contracts**: Required for VA, military, and federal healthcare

---

## 📋 **Pre-Deployment Preparation**

### **Internet-Connected Preparation System**
You'll need a temporary internet-connected system to download and prepare all components before transferring to the air-gapped environment.

#### **Required Downloads:**
1. **MCP Server Codebase** (this repository)
2. **Node.js Runtime** (v18+ LTS)
3. **Ollama Runtime** (latest version)
4. **AI Models** (healthcare-specific models)
5. **Dependencies** (npm packages)
6. **Operating System Updates** (security patches)

### **Preparation Checklist:**
- [ ] Download all required software components
- [ ] Download and package AI models
- [ ] Create offline installation packages
- [ ] Prepare transfer media (encrypted USB drives)
- [ ] Document all checksums for integrity verification
- [ ] Prepare installation scripts for offline deployment

---

## 📦 **Component Download & Packaging**

### **Step 1: Download MCP Server Components**

#### **On Internet-Connected System:**
```bash
# Clone the repository
git clone https://github.com/your-org/ai-mcp-server.git
cd ai-mcp-server

# Download all npm dependencies for offline installation
npm install
npm pack

# Create offline package
tar -czf mcp-server-offline.tar.gz \
  --exclude=node_modules/.cache \
  --exclude=.git \
  .

# Calculate checksum
sha256sum mcp-server-offline.tar.gz > mcp-server.sha256
```

### **Step 2: Download Node.js Runtime**

```bash
# Download Node.js for target platform
wget https://nodejs.org/dist/v18.19.0/node-v18.19.0-linux-x64.tar.xz
wget https://nodejs.org/dist/v18.19.0/node-v18.19.0-darwin-x64.tar.gz
wget https://nodejs.org/dist/v18.19.0/node-v18.19.0-win-x64.zip

# Verify checksums
sha256sum node-v18.19.0-*.* > nodejs.sha256
```

### **Step 3: Download Ollama Runtime**

```bash
# Download Ollama for different platforms
wget https://ollama.ai/download/ollama-linux-amd64
wget https://ollama.ai/download/ollama-darwin
wget https://ollama.ai/download/ollama-windows-amd64.exe

# Make executable
chmod +x ollama-*

# Calculate checksums
sha256sum ollama-* > ollama.sha256
```

### **Step 4: Download AI Models**

```bash
# Install Ollama temporarily to download models
./ollama-linux-amd64 serve &
OLLAMA_PID=$!

# Download healthcare models
./ollama-linux-amd64 pull mistral:7b
./ollama-linux-amd64 pull llama2:7b
./ollama-linux-amd64 pull codellama:7b
./ollama-linux-amd64 pull llava:7b

# Export models for offline transfer
mkdir -p models-export
./ollama-linux-amd64 save mistral:7b > models-export/mistral-7b.tar
./ollama-linux-amd64 save llama2:7b > models-export/llama2-7b.tar
./ollama-linux-amd64 save codellama:7b > models-export/codellama-7b.tar
./ollama-linux-amd64 save llava:7b > models-export/llava-7b.tar

# Stop temporary Ollama
kill $OLLAMA_PID

# Package models
tar -czf healthcare-models-offline.tar.gz models-export/
sha256sum healthcare-models-offline.tar.gz > models.sha256
```

### **Step 5: Create Complete Offline Package**

```bash
# Create comprehensive offline package
mkdir -p air-gapped-deployment
cp mcp-server-offline.tar.gz air-gapped-deployment/
cp node-v18.19.0-*.* air-gapped-deployment/
cp ollama-* air-gapped-deployment/
cp healthcare-models-offline.tar.gz air-gapped-deployment/
cp *.sha256 air-gapped-deployment/

# Create installation script
cat > air-gapped-deployment/install.sh << 'EOF'
#!/bin/bash
set -e

echo "🔒 Air-Gapped Healthcare AI Deployment"
echo "======================================"

# Verify checksums
echo "🔍 Verifying package integrity..."
sha256sum -c *.sha256

# Install Node.js
echo "📦 Installing Node.js..."
tar -xf node-v18.19.0-linux-x64.tar.xz
sudo mv node-v18.19.0-linux-x64 /opt/nodejs
sudo ln -sf /opt/nodejs/bin/node /usr/local/bin/node
sudo ln -sf /opt/nodejs/bin/npm /usr/local/bin/npm

# Install Ollama
echo "🤖 Installing Ollama..."
sudo cp ollama-linux-amd64 /usr/local/bin/ollama
sudo chmod +x /usr/local/bin/ollama

# Extract MCP Server
echo "🏥 Installing MCP Server..."
tar -xzf mcp-server-offline.tar.gz
cd ai-mcp-server
npm ci --offline

# Import AI models
echo "🧠 Importing AI models..."
cd ..
tar -xzf healthcare-models-offline.tar.gz

# Start Ollama service
ollama serve &
sleep 5

# Import models
ollama load < models-export/mistral-7b.tar
ollama load < models-export/llama2-7b.tar
ollama load < models-export/codellama-7b.tar
ollama load < models-export/llava-7b.tar

echo "✅ Air-gapped deployment complete!"
echo "🚀 Start the MCP server with: cd ai-mcp-server && npm run server"
EOF

chmod +x air-gapped-deployment/install.sh

# Create final package
tar -czf air-gapped-healthcare-ai.tar.gz air-gapped-deployment/
sha256sum air-gapped-healthcare-ai.tar.gz > final-package.sha256

echo "✅ Air-gapped package ready: air-gapped-healthcare-ai.tar.gz"
```

---

## 🚛 **Secure Transfer to Air-Gapped Environment**

### **Transfer Media Preparation**

#### **Encrypted USB Drive Setup:**
```bash
# Create encrypted USB drive (Linux)
sudo cryptsetup luksFormat /dev/sdX
sudo cryptsetup luksOpen /dev/sdX secure_transfer
sudo mkfs.ext4 /dev/mapper/secure_transfer
sudo mount /dev/mapper/secure_transfer /mnt/secure

# Copy deployment package
sudo cp air-gapped-healthcare-ai.tar.gz /mnt/secure/
sudo cp final-package.sha256 /mnt/secure/

# Safely unmount
sudo umount /mnt/secure
sudo cryptsetup luksClose secure_transfer
```

#### **Alternative: Encrypted Archive**
```bash
# Create password-protected archive
7z a -p -mhe=on air-gapped-deployment-encrypted.7z air-gapped-healthcare-ai.tar.gz final-package.sha256

# Or use GPG encryption
gpg --symmetric --cipher-algo AES256 air-gapped-healthcare-ai.tar.gz
```

### **Transfer Security Protocols**

1. **Physical Security**:
   - Use tamper-evident seals on transfer media
   - Maintain chain of custody documentation
   - Use dedicated courier or secure transport

2. **Verification**:
   - Verify checksums on both ends
   - Document transfer in security logs
   - Scan for malware before deployment

---

## 🏗️ **Air-Gapped Environment Deployment**

### **Target System Preparation**

#### **System Requirements:**
- **OS**: Linux (Ubuntu 20.04+ LTS recommended)
- **CPU**: 8+ cores for production use
- **RAM**: 32GB+ (16GB minimum)
- **Storage**: 500GB+ SSD
- **Network**: Internal LAN only (no internet access)

#### **Pre-Installation Setup:**
```bash
# Update system (if updates are available offline)
sudo apt update && sudo apt upgrade -y

# Install basic dependencies
sudo apt install -y curl wget tar gzip build-essential

# Create service user
sudo useradd -r -s /bin/false mcp-server
sudo mkdir -p /opt/mcp-server
sudo chown mcp-server:mcp-server /opt/mcp-server
```

### **Installation Process**

#### **Step 1: Transfer and Verify Package**
```bash
# Mount encrypted transfer media
sudo cryptsetup luksOpen /dev/sdX secure_transfer
sudo mount /dev/mapper/secure_transfer /mnt/transfer

# Copy and verify package
cp /mnt/transfer/air-gapped-healthcare-ai.tar.gz .
cp /mnt/transfer/final-package.sha256 .
sha256sum -c final-package.sha256

# Safely remove transfer media
sudo umount /mnt/transfer
sudo cryptsetup luksClose secure_transfer
```

#### **Step 2: Extract and Install**
```bash
# Extract deployment package
tar -xzf air-gapped-healthcare-ai.tar.gz
cd air-gapped-deployment

# Run installation script
sudo ./install.sh

# Verify installation
node --version
ollama --version
ollama list
```

#### **Step 3: Configure Services**

```bash
# Create systemd service for Ollama
sudo tee /etc/systemd/system/ollama.service << EOF
[Unit]
Description=Ollama Service
After=network.target

[Service]
Type=simple
User=mcp-server
ExecStart=/usr/local/bin/ollama serve
Restart=always
RestartSec=3
Environment=OLLAMA_HOST=127.0.0.1:11434

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for MCP Server
sudo tee /etc/systemd/system/mcp-server.service << EOF
[Unit]
Description=MCP Healthcare AI Server
After=network.target ollama.service
Requires=ollama.service

[Service]
Type=simple
User=mcp-server
WorkingDirectory=/opt/mcp-server/ai-mcp-server
ExecStart=/usr/local/bin/node simple-server.js
Restart=always
RestartSec=3
Environment=NODE_ENV=production
Environment=OLLAMA_URL=http://127.0.0.1:11434
Environment=LOCAL_MODELS_ENABLED=true
Environment=HIPAA_MODE=true

[Install]
WantedBy=multi-user.target
EOF

# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable ollama mcp-server
sudo systemctl start ollama
sleep 10
sudo systemctl start mcp-server
```

---

## 🧪 **Air-Gapped Testing & Validation**

### **System Validation**
```bash
# Test Ollama service
curl http://localhost:11434/api/tags

# Test MCP Server
curl http://localhost:3001/api/health

# Test local model integration
curl http://localhost:3001/api/local/status
```

### **Healthcare Workflow Testing**
```bash
# Authenticate
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}' | \
  jq -r '.data.token')

# Test clinical documentation
curl -X POST http://localhost:3001/api/local/process \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "modelName": "mistral:7b",
    "prompt": "Generate a SOAP note for: 65-year-old male with chest pain",
    "type": "text"
  }'
```

### **Performance Benchmarking**
```bash
# Run comprehensive tests
cd /opt/mcp-server/ai-mcp-server
node test-local-models.js

# Expected results in air-gapped environment:
# ✅ Authentication successful
# ✅ Ollama Service: Running
# ✅ Available Healthcare Models: 4
# ✅ All local model tests passed!
```

---

## 🔧 **Air-Gapped Maintenance**

### **Model Updates**
```bash
# Prepare model updates on internet-connected system
ollama pull mistral:7b-instruct-v0.2
ollama save mistral:7b-instruct-v0.2 > mistral-7b-v2.tar

# Transfer to air-gapped system
# Import updated model
ollama load < mistral-7b-v2.tar
ollama rm mistral:7b  # Remove old version
ollama tag mistral:7b-instruct-v0.2 mistral:7b  # Retag
```

### **Security Updates**
```bash
# Download security updates on internet-connected system
apt download $(apt list --upgradable 2>/dev/null | grep -v WARNING | cut -d/ -f1)

# Transfer .deb packages to air-gapped system
sudo dpkg -i *.deb
sudo apt-get install -f  # Fix dependencies
```

### **Backup & Recovery**
```bash
# Create system backup
sudo tar -czf mcp-backup-$(date +%Y%m%d).tar.gz \
  /opt/mcp-server \
  /etc/systemd/system/mcp-server.service \
  /etc/systemd/system/ollama.service \
  ~/.ollama

# Encrypt backup
gpg --symmetric --cipher-algo AES256 mcp-backup-*.tar.gz
```

---

## 📊 **Air-Gapped Performance Optimization**

### **Resource Optimization**
```bash
# Optimize for air-gapped environment
export OLLAMA_MAX_LOADED_MODELS=2  # Limit memory usage
export OLLAMA_NUM_PARALLEL=4       # Optimize for CPU cores
export OLLAMA_KEEP_ALIVE=24h       # Keep models loaded longer
```

### **Monitoring & Alerting**
```bash
# Set up local monitoring (no external dependencies)
# Monitor disk space
df -h | grep -E '9[0-9]%' && echo "ALERT: Disk space critical"

# Monitor memory usage
free -m | awk 'NR==2{printf "Memory Usage: %s/%sMB (%.2f%%)\n", $3,$2,$3*100/$2 }'

# Monitor service status
systemctl is-active ollama mcp-server
```

---

## 🚨 **Air-Gapped Troubleshooting**

### **Common Issues in Air-Gapped Environments**

#### **DNS Resolution Issues**
```bash
# Configure local DNS if needed
echo "127.0.0.1 localhost" >> /etc/hosts
echo "127.0.0.1 mcp-server" >> /etc/hosts
```

#### **Time Synchronization**
```bash
# Set up local NTP server or manual time sync
sudo timedatectl set-time "2025-06-21 12:00:00"
sudo timedatectl set-timezone America/New_York
```

#### **Certificate Issues**
```bash
# Generate self-signed certificates for HTTPS
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

---

## 📋 **Air-Gapped Compliance Documentation**

### **Required Documentation**
1. **Installation Log**: Complete record of installation process
2. **Security Assessment**: Risk analysis for air-gapped deployment
3. **Change Management**: Process for updates and modifications
4. **Incident Response**: Procedures for security incidents
5. **Backup & Recovery**: Data protection and recovery procedures

### **Audit Trail**
```bash
# Enable comprehensive logging
sudo mkdir -p /var/log/mcp-server
sudo chown mcp-server:mcp-server /var/log/mcp-server

# Configure log rotation
sudo tee /etc/logrotate.d/mcp-server << EOF
/var/log/mcp-server/*.log {
    daily
    missingok
    rotate 365
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF
```

---

## 🎉 **Air-Gapped Deployment Success**

### **Verification Checklist**
- [ ] All services running without internet connectivity
- [ ] Healthcare AI models responding correctly
- [ ] Performance meets requirements
- [ ] Security controls in place
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery tested
- [ ] Documentation complete

### **Go-Live Readiness**
Once all verification steps are complete, your air-gapped healthcare AI system is ready for production use with:

- **Complete data sovereignty** - No external data transmission
- **Maximum security** - Isolated from internet threats
- **HIPAA compliance** - Meets highest healthcare security standards
- **Reliable performance** - Consistent AI processing without network dependencies

**🔒 Your healthcare organization now has a fully secure, air-gapped AI-powered system ready for the most sensitive medical data processing.**
