const axios = require('axios');
const { format } = require('date-fns');

const BASE_URL = 'https://api.github.com';
const OWNER = 'chikuma0';
const REPO = 'daily-tech-digest';

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
