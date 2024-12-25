const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const BASE_URL = 'https://api.github.com';
const OWNER = 'chikuma0';
const REPO = 'daily-tech-digest';

const gatherNews = async () => {
  // Example news with emojis and better formatting
  const news = {
    solopreneur: [
      "📱 **Product Hunt Highlight**: Daily summary of top-ranked products",
      "💼 **Indie Hacker Spotlight**: Success stories and learnings",
      "🛠️ **New Tools**: Latest tools and resources for solo entrepreneurs"
    ],
    aiTech: [
      "🤖 **AI Research**: Latest developments in machine learning",
      "💡 **Tech Innovations**: Breakthrough technologies and applications",
      "🔬 **Industry Updates**: Major company announcements and releases"
    ],
    japan: [
      "🗾 **Market Trends**: Current Japanese market movements",
      "🌸 **Tech Scene**: Updates from Japanese startups and tech giants",
      "🚀 **Opportunities**: Market entry and expansion news"
    ],
    insights: [
      "📊 **Analysis**: Key trends and patterns in tech",
      "🎯 **Predictions**: Expert forecasts and market predictions",
      "💭 **Think Pieces**: In-depth analysis of industry developments"
    ]
  };
  return news;
};

const formatDigest = (news) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  return `# Daily Tech & Innovation Digest - ${formattedDate}

## Today's Highlights 🌟

### 🚀 Solopreneur Opportunities & Tools
${news.solopreneur.join('\n')}

### 💡 AI & Tech Breakthroughs
${news.aiTech.join('\n')}

### 🌏 Japan-Specific Updates
${news.japan.join('\n')}

### 🔍 Key Insights
${news.insights.join('\n')}

---
*Generated with ❤️ by Daily Tech Digest*`;
};

const ensureDirectoryExists = async (filePath) => {
  const dirname = path.dirname(filePath);
  try {
    await fs.access(dirname);
  } catch {
    await fs.mkdir(dirname, { recursive: true });
  }
};

const uploadDigest = async (filePath, content) => {
  const url = `${BASE_URL}/repos/${OWNER}/${REPO}/contents/${filePath}`;
  console.log('Uploading to:', url);
  console.log('Token exists:', !!process.env.GITHUB_TOKEN);
  const data = {
    message: `Add day's digest: ${new Date().toISOString().split('T')[0]}`,
    content: Buffer.from(content).toString('base64')
  };

  try {
    await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
  } catch (error) {
    if (error.response?.status === 422) {
      const existingFile = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      data.sha = existingFile.data.sha;
      await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
    } else {
      throw error;
    }
  }
};

const createDigest = async () => {
  try {
    // Get news
    const news = await gatherNews();

    // Format digest
    const digest = formatDigest(news);

    // Get current date
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Create directory structure and file
    const filePath = `digests/${year}/${month}/${year}-${month}-${day}.md`;
    await ensureDirectoryExists(filePath);
    await uploadDigest(filePath, digest);

    console.log('Digest created successfully');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createDigest();