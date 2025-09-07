#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Ensuring proper build structure for deployment...');

// Check if dist directory exists
if (!fs.existsSync('dist')) {
  console.error('❌ dist directory not found. Please run npm run build first.');
  process.exit(1);
}

// Create dist/public directory
const distPublicDir = path.join('dist', 'public');
if (!fs.existsSync(distPublicDir)) {
  fs.mkdirSync(distPublicDir, { recursive: true });
  console.log('✅ Created dist/public directory');
}

// Copy built files to dist/public
const filesToCopy = ['index.html', 'assets'];
filesToCopy.forEach(file => {
  const srcPath = path.join('dist', file);
  const destPath = path.join(distPublicDir, file);
  
  if (fs.existsSync(srcPath)) {
    // Remove existing destination if it exists
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }
    
    // Copy recursively
    if (fs.statSync(srcPath).isDirectory()) {
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
    console.log(`✅ Copied ${file} to dist/public/`);
  }
});

// Copy public assets to dist/public
const publicDir = 'public';
if (fs.existsSync(publicDir)) {
  const publicFiles = fs.readdirSync(publicDir);
  publicFiles.forEach(file => {
    const srcPath = path.join(publicDir, file);
    const destPath = path.join(distPublicDir, file);
    
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }
    
    if (fs.statSync(srcPath).isDirectory()) {
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  console.log('✅ Copied public assets to dist/public/');
}

// Create server/public for development compatibility
const serverPublicDir = path.join('server', 'public');
if (!fs.existsSync(serverPublicDir)) {
  fs.mkdirSync(serverPublicDir, { recursive: true });
}

// Copy everything from dist/public to server/public
fs.cpSync(distPublicDir, serverPublicDir, { recursive: true });
console.log('✅ Created server/public for development compatibility');

// Verify the structure
const requiredFiles = [
  path.join(distPublicDir, 'index.html'),
  path.join('dist', 'index.js')
];

const allExist = requiredFiles.every(file => fs.existsSync(file));
if (allExist) {
  console.log('✅ Build structure verification successful!');
  console.log('📍 Frontend ready at: dist/public/');
  console.log('📍 Backend ready at: dist/index.js');
  
  // Start the server after build structure is ready
  console.log('🚀 Starting server on port 5000...');
  
  // Set production environment
  process.env.NODE_ENV = 'production';
  process.env.PORT = '5000';
  
  // Import and start the server
  const { spawn } = require('child_process');
  
  // Start the server process
  const serverProcess = spawn('node', ['dist/index.js'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production', PORT: '5000' }
  });
  
  // Handle server process events
  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
  
  serverProcess.on('exit', (code) => {
    console.log(`🔴 Server process exited with code ${code}`);
    if (code !== 0) {
      process.exit(code);
    }
  });
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    serverProcess.kill('SIGTERM');
  });
  
  process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    serverProcess.kill('SIGINT');
  });
  
} else {
  console.error('❌ Build structure verification failed!');
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      console.error(`  Missing: ${file}`);
    }
  });
  process.exit(1);
}