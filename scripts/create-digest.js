const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://api.github.com';
const OWNER = 'chikuma0';
const REPO = 'daily-tech-digest';

const gatherNews = async () => {
  const news = {
    solopreneur: [
      "* No updates today"
    ],
    aiTech: [
      "* No updates today"
    ],
    japan: [
      "* No updates today"
    ],
    insights: [
      "* No updates today"
    ]
  };
  return news;
};

const formatDigest = (news) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  return `# Daily Tech & Innovation Digest - ${formattedDate}\n\n### 🚀 Solopreneur Opportunities & Tools\n${news.solopreneur.join('\n')}\n\n### 💡 AI & Tech Breakthroughs\n${news.aiTech.join('\n')}\n\n### 🌏 Japan-Specific Updates\n${news.japan.join('\n')}\n\n### 🔍 Key Insights\n${news.insights.join('\n')}`;
};

const uploadDigest = async (path, content) => {
  const url = `${BASE_URL}/repos/${OWNER}/${REPO}/contents/${path}`;
  const data = {
    message: `Addday's digest`,
    content: Buffer.from(content).toString('base64')
  };

  try {
    await axios.put(url, data, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
  } catch (error) {
    if (error.response?.status === 422) {
      // File exists, get SHA and update
      const existingFile = await axios.get(url, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      data.sha = existingFile.data.sha;
      await axios.put(url, data, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
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

    // Create or update file
    const filePath = `digests/${year}/${month}/${year}-${month}-${day}.md`;
    await uploadDigest(filePath, digest);

    console.log('Digest created successfully');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createDigest();