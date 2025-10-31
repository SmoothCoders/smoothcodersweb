#!/bin/bash

echo "================================================"
echo "🧪 COMPREHENSIVE TESTING SCRIPT FOR SMOOTHCODERS"
echo "================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3000"

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    
    echo -n "Testing $description... "
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    
    if [ "$status_code" -eq 200 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
    elif [ "$status_code" -eq 500 ]; then
        echo -e "${RED}✗ FAILED${NC} (Status: $status_code - Internal Server Error)"
    elif [ "$status_code" -eq 404 ]; then
        echo -e "${RED}✗ FAILED${NC} (Status: $status_code - Not Found)"
    else
        echo -e "${YELLOW}⚠ WARNING${NC} (Status: $status_code)"
    fi
}

# Function to test API endpoint
test_api() {
    local endpoint=$1
    local description=$2
    
    echo -n "Testing $description... "
    response=$(curl -s "$BASE_URL$endpoint")
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    
    if [ "$status_code" -eq 200 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
        echo "   Response: ${response:0:100}..."
    elif [ "$status_code" -eq 500 ]; then
        echo -e "${RED}✗ FAILED${NC} (Status: $status_code)"
        error_msg=$(echo $response | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
        if [ ! -z "$error_msg" ]; then
            echo "   Error: $error_msg"
        fi
    else
        echo -e "${YELLOW}⚠ WARNING${NC} (Status: $status_code)"
    fi
}

echo "📄 TESTING PUBLIC PAGES"
echo "------------------------"
test_endpoint "/" "Homepage"
test_endpoint "/about" "About Page"
test_endpoint "/services" "Services Page"
test_endpoint "/contact" "Contact Page"
test_endpoint "/portfolio" "Portfolio Page"
test_endpoint "/blog" "Blog Page"
test_endpoint "/testimonials" "Testimonials Page"
echo ""

echo "🔧 TESTING API ENDPOINTS"
echo "------------------------"
test_api "/api/auth/session" "Auth Session API"
test_api "/api/services" "Services API"
test_api "/api/admin/services" "Admin Services API"
test_api "/api/admin/cities" "Admin Cities API"
echo ""

echo "🔐 TESTING ADMIN ROUTES"
echo "------------------------"
test_endpoint "/admin" "Admin Dashboard"
test_endpoint "/admin/services" "Admin Services Page"
test_endpoint "/admin/cities" "Admin Cities Page"
echo ""

echo "================================================"
echo "📊 TEST SUMMARY"
echo "================================================"
echo ""
echo "Server is running at: $BASE_URL"
echo ""
echo "Known Issues:"
echo "1. MongoDB Atlas IP Whitelist - Admin API routes failing"
echo "2. Check authentication flow requires testing with credentials"
echo ""
echo "Next Steps:"
echo "1. Whitelist current IP in MongoDB Atlas"
echo "2. Test authentication with admin credentials"
echo "3. Test payment integration with Razorpay"
echo ""
