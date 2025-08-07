# AI Integration Setup Guide

This guide will help you set up the AI services for EduTok's content generation features.

## 🤖 Required AI Services

### 1. OpenAI (ChatGPT)
- **Purpose**: Generate educational video scripts
- **Cost**: ~$0.03 per 1K tokens
- **Setup**: 
  1. Go to [OpenAI Platform](https://platform.openai.com/)
  2. Create an account and add billing
  3. Generate an API key
  4. Add to your `.env` file

### 2. ElevenLabs (Text-to-Speech)
- **Purpose**: Convert scripts to natural-sounding voice
- **Cost**: Free tier available (10,000 characters/month)
- **Setup**:
  1. Go to [ElevenLabs](https://elevenlabs.io/)
  2. Create an account
  3. Generate an API key
  4. Add to your `.env` file

## 🔧 Setup Instructions

### Step 1: Get API Keys

1. **OpenAI API Key**:
   ```bash
   # Visit: https://platform.openai.com/api-keys
   # Create a new secret key
   ```

2. **ElevenLabs API Key**:
   ```bash
   # Visit: https://elevenlabs.io/app/api-key
   # Copy your API key
   ```

### Step 2: Configure Environment

1. **Copy the example environment file**:
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Edit `.env` and add your API keys**:
   ```env
   # AI Services
   OPENAI_API_KEY=sk-your-openai-key-here
   ELEVENLABS_API_KEY=your-elevenlabs-key-here
   ```

### Step 3: Install Dependencies

```bash
cd backend
pip install -r requirements_ai.txt
```

### Step 4: Test the Integration

```bash
# Test AI services
python test_ai_integration.py

# Or test via API
curl http://localhost:8000/videos/ai/service-status
```

## 🧪 Testing AI Services

### Test Script Generation
```bash
curl -X POST "http://localhost:8000/videos/ai/generate-script" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Python Basics",
    "category": "ai-machine-learning",
    "difficulty": "beginner",
    "target_audience": "beginners",
    "duration_minutes": 1,
    "style": "engaging and educational"
  }'
```

### Test Service Status
```bash
curl http://localhost:8000/videos/ai/service-status
```

## 💰 Cost Estimation

### OpenAI (GPT-4)
- **Script Generation**: ~$0.01-0.03 per script
- **Typical Usage**: 100-300 tokens per script
- **Monthly Cost**: $1-5 for moderate usage

### ElevenLabs
- **Free Tier**: 10,000 characters/month
- **Paid Plans**: Starting at $22/month
- **Cost per Video**: ~$0.10-0.50 per 3-minute video

## 🔍 Troubleshooting

### Common Issues

1. **"OpenAI API key not found"**
   - Check your `.env` file
   - Ensure the key is valid and has credits

2. **"ElevenLabs API key not found"**
   - Verify your API key in `.env`
   - Check your ElevenLabs account status

3. **"Rate limit exceeded"**
   - Wait a few minutes and try again
   - Check your API usage limits

4. **"Network error"**
   - Check your internet connection
   - Verify firewall settings

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=true
```

## 🚀 Next Steps

Once AI integration is working:

1. **Test script generation** with different topics
2. **Experiment with voice settings** for different styles
3. **Create a content generation interface** in the mobile app
4. **Add batch generation** for multiple videos
5. **Implement video synthesis** for complete video creation

## 📊 Monitoring

Check AI service usage:
```bash
curl http://localhost:8000/videos/ai/stats
```

## 🔐 Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Monitor API usage to avoid unexpected charges
- Consider rate limiting for production use
