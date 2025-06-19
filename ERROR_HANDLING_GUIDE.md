# HVAC Decoder Error Handling Guide

This guide explains all the error scenarios handled by the TechTag HVAC decoder system and what they mean for users and developers.

## 🚨 **Input Validation Errors**

### **Empty Model Number**
- **Error**: "Please enter a model number to decode"
- **Cause**: User submitted empty or whitespace-only input
- **Solution**: Enter a valid model number

### **Too Short**
- **Error**: "Model number must be at least 2 characters long"
- **Cause**: Model number has fewer than 2 characters
- **Solution**: Provide complete model number

### **Too Long** 
- **Error**: "Model number is too long (maximum 50 characters)"
- **Cause**: Model number exceeds 50 character limit
- **Solution**: Check for extra characters or serial numbers

### **Invalid Characters**
- **Error**: "Model number can only contain letters, numbers, hyphens, and underscores"
- **Cause**: Model number contains special characters like @, #, %, etc.
- **Solution**: Remove special characters, use only alphanumeric characters, hyphens, and underscores

## 🌐 **Network & Connection Errors**

### **Connection Failed**
- **Error**: "Unable to connect to the decoder service. Please check your internet connection and try again."
- **Cause**: Network connectivity issues or API endpoint unreachable
- **Troubleshooting**:
  - Check internet connection
  - Refresh the page
  - Try again in a few moments
  - Check if server is running (for developers)

### **Request Timeout**
- **Error**: "Request timed out - please check your connection and try again"
- **Cause**: Request took longer than 10 seconds to complete
- **Troubleshooting**:
  - Check internet connection speed
  - Try with a shorter model number
  - Server may be under heavy load

## 🗄️ **Database Errors**

### **Database Connection Failed**
- **Error**: "Database connection failed. Please try again later."
- **Cause**: Cannot connect to the Prisma database
- **For Users**: Try again in a few minutes
- **For Developers**: 
  - Check DATABASE_URL in .env file
  - Ensure database server is running
  - Verify database credentials

### **Database Connection Refused**
- **Error**: "Database connection refused. Please try again later."
- **Cause**: Database server refusing connections
- **For Developers**:
  - Database server may be down
  - Check firewall settings
  - Verify database service is running

### **Database Server Not Found**
- **Error**: "Database server not found. Please contact support."
- **Cause**: Database hostname cannot be resolved
- **For Developers**:
  - Check DATABASE_URL hostname
  - Verify DNS resolution
  - Check network connectivity to database

### **No Decoding Rules Available**
- **Error**: "No decoding rules available. Please contact support."
- **Cause**: Database is empty or has no CodeRule records
- **For Developers**:
  - Run database seeding: `npx prisma db seed`
  - Check if database migration completed
  - Verify CodeRule table exists

## 🔧 **Server Errors**

### **Invalid JSON Request**
- **Error**: "Invalid JSON in request body"
- **Cause**: Malformed JSON sent to API
- **For Developers**: Check request formatting

### **Internal Server Error**
- **Error**: "Internal server error. Please try again later."
- **Cause**: Unexpected server-side error
- **For Developers**: Check server logs for specific error details

### **Service Unavailable**
- **Error**: "Service temporarily unavailable"
- **Cause**: Server is temporarily overloaded or under maintenance
- **Solution**: Wait and try again later

## 🔍 **Decoding Result Scenarios**

### **No Pattern Match Found**
- **Scenario**: Model number doesn't match any rules in database
- **Displays**: Suggestions and troubleshooting tips
- **Common Causes**:
  - Model number format not yet supported
  - Typo in model number
  - Serial number entered instead of model number
  - New or uncommon manufacturer

### **Partial Match (Low/Medium Confidence)**
- **Scenario**: Some segments matched but not complete coverage
- **Displays**: Matched segments + unmatched segments
- **Causes**:
  - Incomplete rule set for that manufacturer
  - Additional suffixes or codes not in database
  - Mixed model number formats

### **High Confidence Match**
- **Scenario**: 80%+ of model number matched with 3+ segments
- **Displays**: Complete breakdown by category
- **Result**: Successful decode

## 🛠️ **Developer Troubleshooting**

### **Local Development Setup**

1. **Check Environment Variables**:
   ```bash
   echo $DATABASE_URL  # or $env:DATABASE_URL on Windows
   ```

2. **Verify Database Setup**:
   ```bash
   npx prisma studio  # Opens database GUI
   npx prisma db seed  # Re-seed if needed
   ```

3. **Test API Directly**:
   ```bash
   curl -X POST http://localhost:3000/api/decode \
     -H "Content-Type: application/json" \
     -d '{"modelNumber":"25HCC024300"}'
   ```

4. **Check Server Logs**:
   - Look at terminal output for error details
   - Check browser developer console for client-side errors

### **Production Debugging**

1. **Database Connection**:
   - Verify DATABASE_URL environment variable
   - Check database server status
   - Verify SSL certificates if using secure connection

2. **API Endpoints**:
   - Ensure `/api/decode` route is deployed
   - Check server logs for runtime errors
   - Verify Prisma client is generated

## 📱 **User Experience Features**

### **Progressive Error Disclosure**
- Simple error message first
- Detailed troubleshooting steps expand based on error type
- Helpful examples provided for common issues

### **Error Recovery**
- Users can immediately retry after fixing input
- Form state preserved during errors
- Clear indication of what went wrong

### **Loading States**
- Visual spinner during processing
- Disabled form during requests
- Timeout handling with user feedback

## 🔄 **Error Recovery Actions**

### **For Connection Issues**:
1. Retry automatically after short delay
2. Show offline message if persistent
3. Provide manual retry button

### **For Input Issues**:
1. Highlight problematic input
2. Show format examples
3. Auto-correct common mistakes where possible

### **For Service Issues**:
1. Show estimated recovery time
2. Provide alternative contact methods
3. Log issues for monitoring

## 📊 **Error Monitoring**

### **What Gets Logged**:
- All server-side errors with stack traces
- Failed database connections
- Invalid input attempts (for pattern analysis)
- API response times

### **What Doesn't Get Logged**:
- Valid user input (privacy)
- Successful decode results
- User personal information

This comprehensive error handling ensures users always know what's happening and how to resolve issues, while providing developers with detailed debugging information. 