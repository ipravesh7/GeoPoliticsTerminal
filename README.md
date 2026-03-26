# Geopolitical Intelligence Feed System

A real-time intelligence aggregation platform that monitors 50+ sources including Telegram OSINT channels, wire services, ISW assessments, and official government channels. Features portfolio-aware alerting and AI-powered relevance filtering.

## 🎯 Features

- **Multi-Source Aggregation**: Telegram OSINT channels, Reuters/Bloomberg/AP, ISW assessments, official government social media
- **Real-Time Monitoring**: Continuous scraping with configurable intervals
- **Portfolio-Aware Alerts**: Automatic filtering based on your portfolio exposure (commodities, equities, currencies)
- **Entity Extraction**: NLP-powered identification of countries, organizations, and key figures
- **Sentiment Analysis**: Automatic sentiment scoring for each intelligence item
- **Alert Level Classification**: Critical/High/Medium/Low categorization based on content
- **Interactive Dashboard**: React-based UI with filtering, search, and real-time updates
- **API Integration**: RESTful API for programmatic access

## 📋 Prerequisites

### Required Credentials

1. **Telegram API** (for OSINT channels)
   - Get your API ID and Hash: https://my.telegram.org/apps
   
2. **Twitter/X API** (for official leader channels)
   - Apply for access: https://developer.twitter.com/
   - Need: Bearer Token
   
3. **News Wire Services** (optional but recommended)
   - Reuters API: Contact Reuters for access
   - Bloomberg Terminal or API access
   - Associated Press API

### System Requirements

- Python 3.9+
- Node.js 16+ (for dashboard)
- 4GB RAM minimum
- Internet connection with good bandwidth

## 🚀 Installation

### 1. Clone and Setup Python Environment

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm
```

### 2. Configure Credentials

```bash
# Copy example config
cp config.example.json config.json

# Edit config.json with your credentials
nano config.json
```

**Important**: Never commit `config.json` to version control!

### 3. Telegram Setup

```bash
# Run Telegram authentication
python -c "
from telethon import TelegramClient
client = TelegramClient('intel_session', 'YOUR_API_ID', 'YOUR_API_HASH')
client.start()
print('Authenticated successfully!')
"
```

This creates an `intel_session.session` file for persistent auth.

### 4. Configure Portfolio

Edit the `portfolio` section in `config.json`:

```json
{
  "portfolio": {
    "commodities": {
      "oil": ["russia", "opec", "iran", "saudi"],
      "wheat": ["ukraine", "russia", "black sea"]
    },
    "equities": {
      "defense": ["lockheed", "raytheon"],
      "semiconductors": ["taiwan", "tsmc", "china"]
    }
  }
}
```

## 🎮 Usage

### Running the Backend

```bash
# Start the intelligence feed
python intel_feed_backend.py
```

This will:
- Connect to all configured sources
- Start real-time monitoring
- Output portfolio-relevant alerts to console
- Store data in local database

### Running the Dashboard

The dashboard is a React component. To use it:

1. **In a React app**:
```bash
npm install lucide-react
# Copy geopolitical_intel_feed.jsx to your src/components
```

2. **Standalone**:
```bash
npx create-react-app intel-dashboard
cd intel-dashboard
npm install lucide-react
# Copy geopolitical_intel_feed.jsx to src/
# Update src/App.js to import and render the component
npm start
```

### API Endpoints (Optional FastAPI Server)

Create `api_server.py`:

```python
from fastapi import FastAPI
from intel_feed_backend import IntelligenceFeed

app = FastAPI()
feed = IntelligenceFeed(config)

@app.get("/api/items")
async def get_items(limit: int = 50):
    return feed.items[:limit]

@app.get("/api/portfolio-summary")
async def get_portfolio_summary():
    # Return portfolio impact analysis
    pass
```

Run with: `uvicorn api_server:app --reload`

## 📊 Source Configuration

### Telegram OSINT Channels

Popular channels to monitor:
```
- intelslava (Pro-Russian)
- rybar_en (Russian military analysis)
- warfakes (Debunking)
- osint_battlespace (Neutral analysis)
- legitimniy (Ukraine-focused)
- grey_zone (PMC Wagner affiliated)
- milinfolive (Military news)
```

### ISW (Institute for the Study of War)

The scraper automatically fetches:
- Daily Russian offensive campaign assessments
- Ukraine conflict updates
- Iran updates
- Other regional analyses

### Wire Services Integration

**Reuters**: 
```python
# Example integration
async def fetch_reuters(self, since: datetime):
    url = "https://api.reuters.com/v1/news"
    params = {
        "apikey": self.api_keys["reuters"],
        "since": since.isoformat(),
        "topics": "politics,war,conflict"
    }
    # Fetch and process
```

## 🔔 Alert Configuration

### Alert Levels

The system classifies items into 5 levels:

1. **CRITICAL**: Nuclear events, invasions, coups, assassinations
2. **HIGH**: Military actions, major sanctions, escalations
3. **MEDIUM**: Tensions, disputes, warnings
4. **LOW**: Portfolio-relevant but non-urgent
5. **INFO**: General news, no portfolio impact

### Custom Alert Rules

Add to `config.json`:

```json
{
  "alert_settings": {
    "critical_keywords": ["nuclear", "invasion"],
    "notification_channels": {
      "email": "your@email.com",
      "telegram_bot": "YOUR_BOT_TOKEN",
      "slack_webhook": "WEBHOOK_URL"
    }
  }
}
```

## 🎯 Portfolio Analysis

The system automatically matches intelligence to your portfolio:

```python
# Example: Oil position
"commodities": {
  "oil": ["russia", "opec", "middle east", "iran"]
}

# When "Russia" or "OPEC" appears → flags as oil-relevant
# Alert level depends on content severity
```

### Portfolio Impact Dashboard

The dashboard shows:
- Which assets are most frequently mentioned
- Alert level distribution per asset
- Timeline of portfolio-relevant events
- Sentiment trends

## 🔧 Advanced Configuration

### Custom Entity Extraction

Replace the simple regex with spaCy:

```python
class EntityExtractor:
    def __init__(self):
        import spacy
        self.nlp = spacy.load("en_core_web_sm")
    
    def extract(self, text: str) -> List[str]:
        doc = self.nlp(text)
        return [ent.text for ent in doc.ents 
                if ent.label_ in ['GPE', 'ORG', 'PERSON']]
```

### Database Integration

Add PostgreSQL storage:

```python
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class IntelItem(Base):
    __tablename__ = 'intel_items'
    id = Column(String, primary_key=True)
    timestamp = Column(DateTime)
    # ... other fields

engine = create_engine('postgresql://user:pass@localhost/intel')
Base.metadata.create_all(engine)
```

### Rate Limiting

Prevent API bans:

```python
from ratelimit import limits, sleep_and_retry

@sleep_and_retry
@limits(calls=15, period=60)  # 15 calls per minute
async def fetch_tweets(self):
    # Your API call
    pass
```

## 📈 Performance Optimization

### Caching with Redis

```python
import redis
r = redis.Redis(host='localhost', port=6379)

# Cache ISW assessments (update every hour)
cached = r.get('isw_latest')
if cached:
    return json.loads(cached)
else:
    data = await self.fetch_isw()
    r.setex('isw_latest', 3600, json.dumps(data))
    return data
```

### Async Optimization

Process all sources concurrently:

```python
async def fetch_all_sources(self):
    results = await asyncio.gather(
        self.telegram_scraper.fetch_updates(since),
        self.isw_scraper.fetch_latest(),
        self.wire_aggregator.fetch_reuters(since),
        self.official_monitor.fetch_tweets(since)
    )
    return self.process_all_results(results)
```

## 🛡️ Security Best Practices

1. **Never commit credentials**
   ```bash
   echo "config.json" >> .gitignore
   echo "*.session" >> .gitignore
   ```

2. **Use environment variables**
   ```python
   import os
   from dotenv import load_dotenv
   
   load_dotenv()
   api_key = os.getenv('REUTERS_API_KEY')
   ```

3. **Encrypt sensitive data**
   ```python
   from cryptography.fernet import Fernet
   
   # Encrypt API keys in config
   key = Fernet.generate_key()
   cipher = Fernet(key)
   encrypted = cipher.encrypt(b"SECRET_API_KEY")
   ```

## 📱 Notification Setup

### Telegram Bot Alerts

```python
from telegram import Bot

async def send_alert(item: IntelItem):
    if item.alert_level in ['critical', 'high']:
        bot = Bot(token=config['telegram_bot_token'])
        message = f"🚨 {item.alert_level.upper()}\n\n{item.title}\n\n{item.url}"
        await bot.send_message(chat_id=YOUR_CHAT_ID, text=message)
```

### Email Alerts

```python
import smtplib
from email.mime.text import MIMEText

def send_email_alert(item: IntelItem):
    msg = MIMEText(f"{item.title}\n\n{item.content}\n\n{item.url}")
    msg['Subject'] = f"[{item.alert_level.upper()}] Geopolitical Alert"
    msg['From'] = "intel@yourcompany.com"
    msg['To'] = config['alert_email']
    
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(user, password)
        server.send_message(msg)
```

## 🐛 Troubleshooting

### Common Issues

**Telegram Auth Failed**
```bash
# Delete session and re-authenticate
rm intel_session.session*
python -c "from telethon import TelegramClient; ..."
```

**Twitter Rate Limits**
- Upgrade to Twitter API v2 Essential ($100/month)
- Or reduce polling frequency in config

**ISW Scraping Blocked**
- ISW may have rate limiting
- Add delays between requests
- Consider using their RSS feed instead

**Memory Issues**
```python
# Limit stored items
if len(self.items) > 10000:
    self.items = self.items[:5000]  # Keep newest 5000
```

## 📚 Additional Resources

- [Telegram API Docs](https://core.telegram.org/api)
- [Twitter API v2 Docs](https://developer.twitter.com/en/docs/twitter-api)
- [ISW Website](https://www.understandingwar.org/)
- [spaCy NLP](https://spacy.io/)
- [VADER Sentiment](https://github.com/cjhutto/vaderSentiment)

## 🤝 Contributing

This is a personal intelligence tool. Customize as needed for your use case.

## ⚠️ Legal Disclaimer

- Respect ToS of all platforms (Telegram, Twitter, news services)
- This tool is for personal informational purposes
- Do not redistribute copyrighted content
- Comply with financial regulations if using for trading
- Some sources may require paid API access

## 📄 License

MIT License - Use at your own risk

---

**Built for professional geopolitical risk analysis and portfolio management**
