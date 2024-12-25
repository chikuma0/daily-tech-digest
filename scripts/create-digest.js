const axios = require('axios');

const testAuth = async () => {
  console.log('Token exists:', !!process.env.NEWS_DIGEST);
  console.log('Token length:', process.env.NEWS_DIGEST ? process.env.NEWS_DIGEST.length : 0);
  
  try {
    // First, try to get the file to get its SHA
    const fileUrl = 'https://api.github.com/repos/chikuma0/daily-tech-digest/contents/test.md';
    let sha;
    
    try {
      const fileResponse = await axios.get(fileUrl, {
        headers: {
          Authorization: `token ${process.env.NEWS_DIGEST}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'daily-tech-digest'
        }
      });
      sha = fileResponse.data.sha;
    } catch (error) {
      // File doesn't exist yet, which is fine
      sha = null;
    }
    
    // Now create/update the file
    const response = await axios.put(
      fileUrl,
      {
        message: 'test auth',
        content: Buffer.from('test content').toString('base64'),
        sha: sha  // Include SHA if we're updating, omit if creating new file
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