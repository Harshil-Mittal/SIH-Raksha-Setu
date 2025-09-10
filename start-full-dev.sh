#!/bin/bash

# RakshaSetu Full Development Startup Script (with Blockchain)
echo "🚀 Starting RakshaSetu Full Development Environment with Blockchain..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to start blockchain backend
start_blockchain_backend() {
    echo "⛓️ Starting Blockchain Backend Server..."
    cd blockchain
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing blockchain dependencies..."
        npm install
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "⚙️ Creating blockchain environment file..."
        cp env.example .env
    fi
    
    # Start blockchain backend in background
    npm run dev &
    BLOCKCHAIN_PID=$!
    echo "✅ Blockchain backend started with PID: $BLOCKCHAIN_PID"
    cd ..
}

# Function to start language backend
start_language_backend() {
    echo "🌐 Starting Language Backend Server..."
    cd backend
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing language backend dependencies..."
        npm install
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "⚙️ Creating language backend environment file..."
        cp env.example .env
    fi
    
    # Start language backend in background
    npm run dev &
    LANGUAGE_PID=$!
    echo "✅ Language backend started with PID: $LANGUAGE_PID"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend Server..."
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Frontend started with PID: $FRONTEND_PID"
}

# Function to start local blockchain node (optional)
start_local_blockchain() {
    echo "🔗 Starting Local Blockchain Node..."
    
    # Check if hardhat is available
    if command -v npx &> /dev/null; then
        cd blockchain
        npx hardhat node &
        LOCAL_BLOCKCHAIN_PID=$!
        echo "✅ Local blockchain node started with PID: $LOCAL_BLOCKCHAIN_PID"
        cd ..
        
        # Wait for local node to start
        sleep 5
        
        # Deploy contracts to local node
        echo "📄 Deploying contracts to local node..."
        cd blockchain
        npx hardhat run scripts/deploy.ts --network localhost &
        DEPLOY_PID=$!
        echo "✅ Contract deployment started with PID: $DEPLOY_PID"
        cd ..
    else
        echo "⚠️ Hardhat not available, skipping local blockchain node"
    fi
}

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down all servers..."
    if [ ! -z "$BLOCKCHAIN_PID" ]; then
        kill $BLOCKCHAIN_PID 2>/dev/null
    fi
    if [ ! -z "$LANGUAGE_PID" ]; then
        kill $LANGUAGE_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    if [ ! -z "$LOCAL_BLOCKCHAIN_PID" ]; then
        kill $LOCAL_BLOCKCHAIN_PID 2>/dev/null
    fi
    if [ ! -z "$DEPLOY_PID" ]; then
        kill $DEPLOY_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start all servers
echo "🚀 Starting all services..."

# Start local blockchain (optional)
if [ "$1" = "--with-local-blockchain" ]; then
    start_local_blockchain
fi

# Start blockchain backend
start_blockchain_backend
sleep 3

# Start language backend
start_language_backend
sleep 3

# Start frontend
start_frontend

echo ""
echo "🎉 RakshaSetu Full Development Environment is running!"
echo "📱 Frontend: http://localhost:8080 (or next available port)"
echo "🌐 Language API: http://localhost:3001"
echo "⛓️ Blockchain API: http://localhost:3002"
echo "🔗 Local Blockchain: http://localhost:8545 (if started)"
echo ""
echo "📊 Health Checks:"
echo "  - Language API: http://localhost:3001/api/health"
echo "  - Blockchain API: http://localhost:3002/api/health"
echo ""
echo "🔧 Features Available:"
echo "  ✅ Multilingual Support (12 languages)"
echo "  ✅ Translation Services"
echo "  ✅ Text-to-Speech & Speech-to-Text"
echo "  ✅ Digital Identity Management"
echo "  ✅ Blockchain Integration"
echo "  ✅ Wallet Management"
echo "  ✅ Smart Contract Operations"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait
