const axios = require('axios');

const testAuth = async () => {
  console.log('Token exists:', !!process.env.NEWS_DIGEST);
  console.log('Token length:', process.env.NEWS_DIGEST ? process.env.NEWS_DIGEST.length : 0);
  
  try {
    const response = await axios.put(
      'https://api.github.com/repos/chikuma0/daily-tech-digest/contents/test.md',
      {
        message: 'test auth',
        content: Buffer.from('test content').toString('base64')
      },
      {
        headers: {
          Authorization: `token ${process.env.NEWS_DIGEST}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'daily-tech-digest'
        }
      }
    );
    console.log('Success:', response.status);
    return response.status;
  } catch (error) {
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    process.exit(1);
  }
};

testAuth().then(status => {
  console.log('Final status:', status);
}).catch(err => {
  console.error('Final error:', err);
  process.exit(1);
});