const axios = require('axios');

const testAuth = async () => {
  console.log('Token exists:', !!process.env.NEWS_DIGEST);
  
  try {
    const response = await axios.put(
      'https://api.github.com/repos/chikuma0/daily-tech-digest/contents/test.md',
      {
        message: 'test auth',
        content: Buffer.from('test content').toString('base64')
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEWS_DIGEST}`,
          'Content-Type': 'application/json',
        }
      }
    );
    console.log('Success:', response.status);
  } catch (error) {
    console.error('Full error:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
};

testAuth();