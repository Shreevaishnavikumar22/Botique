#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Battery E-commerce Application...\n');

// Check if MongoDB is running
const checkMongoDB = () => {
  return new Promise((resolve) => {
    const mongodb = spawn('mongosh', ['--eval', 'db.runCommand("ping")'], { 
      stdio: 'pipe',
      shell: true 
    });
    
    mongodb.on('close', (code) => {
      resolve(code === 0);
    });
    
    mongodb.on('error', () => {
      resolve(false);
    });
    
    // Timeout after 3 seconds
    setTimeout(() => {
      mongodb.kill();
      resolve(false);
    }, 3000);
  });
};

const startBackend = () => {
  return new Promise((resolve, reject) => {
    console.log('📦 Starting Backend Server...');
    
    const backend = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'pipe',
      shell: true
    });
    
    backend.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Server running on port')) {
        console.log('✅ Backend server started successfully!');
        resolve(backend);
      }
    });
    
    backend.stderr.on('data', (data) => {
      console.error('Backend Error:', data.toString());
    });
    
    backend.on('error', (error) => {
      reject(error);
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      reject(new Error('Backend startup timeout'));
    }, 10000);
  });
};

const startFrontend = () => {
  return new Promise((resolve, reject) => {
    console.log('🎨 Starting Frontend Server...');
    
    const frontend = spawn('npm', ['start'], {
      cwd: path.join(__dirname, 'frontend'),
      stdio: 'pipe',
      shell: true,
      env: { ...process.env, BROWSER: 'none' }
    });
    
    frontend.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes('webpack compiled')) {
        console.log('✅ Frontend server started successfully!');
        resolve(frontend);
      }
    });
    
    frontend.stderr.on('data', (data) => {
      console.error('Frontend Error:', data.toString());
    });
    
    frontend.on('error', (error) => {
      reject(error);
    });
    
    // Timeout after 15 seconds
    setTimeout(() => {
      reject(new Error('Frontend startup timeout'));
    }, 15000);
  });
};

const main = async () => {
  try {
    // Check MongoDB
    console.log('🔍 Checking MongoDB connection...');
    const mongoRunning = await checkMongoDB();
    
    if (!mongoRunning) {
      console.log('❌ MongoDB is not running. Please start MongoDB first.');
      console.log('   Windows: net start MongoDB');
      console.log('   macOS: brew services start mongodb-community');
      console.log('   Linux: sudo systemctl start mongod');
      process.exit(1);
    }
    
    console.log('✅ MongoDB is running!\n');
    
    // Check if .env files exist
    const fs = require('fs');
    const backendEnvPath = path.join(__dirname, 'backend', '.env');
    const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
    
    if (!fs.existsSync(backendEnvPath)) {
      console.log('⚠️  Backend .env file not found. Creating from template...');
      const backendEnvExample = path.join(__dirname, 'backend', 'config.env.example');
      if (fs.existsSync(backendEnvExample)) {
        fs.copyFileSync(backendEnvExample, backendEnvPath);
        console.log('✅ Backend .env file created. Please edit it with your configuration.');
      }
    }
    
    if (!fs.existsSync(frontendEnvPath)) {
      console.log('⚠️  Frontend .env file not found. Creating...');
      fs.writeFileSync(frontendEnvPath, 'REACT_APP_API_URL=http://localhost:5000/api\n');
      console.log('✅ Frontend .env file created.');
    }
    
    // Start servers
    const backend = await startBackend();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    const frontend = await startFrontend();
    
    console.log('\n🎉 Application started successfully!');
    console.log('📱 Frontend: http://localhost:3000');
    console.log('🔧 Backend: http://localhost:5000');
    console.log('🏥 Health Check: http://localhost:5000/api/health');
    console.log('\n👤 Default Login Credentials:');
    console.log('   Admin: admin@batterystore.com / admin123');
    console.log('   User: john@example.com / password123');
    console.log('\n💡 Tip: Run "npm run seed" in backend directory to populate database');
    console.log('\nPress Ctrl+C to stop all servers\n');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down servers...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error starting application:', error.message);
    process.exit(1);
  }
};

main();
