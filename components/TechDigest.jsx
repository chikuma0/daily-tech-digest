import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const TechDigest = () => {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the latest digest
    const fetchDigest = async () => {
      try {
        const response = await fetch('/api/latest-digest');
        const data = await response.json();
        setDigest(data);
      } catch (error) {
        console.error('Error fetching digest:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDigest();
  }, []);

  if (loading) {
    return <div>Loading today's digest...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Daily Tech & Innovation Digest
      </h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            🚀 Solopreneur Opportunities & Tools
          </h2>
          {digest?.solopreneur.map((item, index) => (
            <div key={index} className="mb-2">
              {item}
            </div>
          ))}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            💡 AI & Tech Breakthroughs
          </h2>
          {digest?.aiTech.map((item, index) => (
            <div key={index} className="mb-2">
              {item}
            </div>
          ))}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            🌏 Japan-Specific Updates
          </h2>
          {digest?.japan.map((item, index) => (
            <div key={index} className="mb-2">
              {item}
            </div>
          ))}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            🔍 Key Insights
          </h2>
          {digest?.insights.map((item, index) => (
            <div key={index} className="mb-2">
              {item}
            </div>
          ))}
        </Card>
      </div>

      <footer className="mt-8 text-center text-gray-500">
        Generated with ❤️ by Daily Tech Digest
      </footer>
    </div>
  );
};

export default TechDigest;