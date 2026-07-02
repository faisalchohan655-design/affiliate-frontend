import { useState, useEffect } from 'react';

export default function Home() {
  const [product, setProduct] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [campaignId, setCampaignId] = useState(null);
  const [status, setStatus] = useState('');
  const [data, setData] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/status?id=${campaignId}`);
      const d = await res.json();
      setStatus(d.status);
      if (d.status === 'completed' || d.status === 'failed') {
        clearInterval(interval);
        if (d.status === 'completed') {
          const dl = await fetch(`/api/download?id=${campaignId}`);
          setData(await dl.json());
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [campaignId]);

  const handleGenerate = async () => {
    setLoading(true); setData(null);
    const res = await fetch('/api/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, affiliateLink })
    });
    const json = await res.json();
    setCampaignId(json.id);
    setLoading(false);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert('✅ Copied to clipboard!');
  };

  // ✅ Extract Image URL from HTML
  const extractImageUrl = (htmlContent) => {
    if (!htmlContent) return null;
    const match = htmlContent.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/i);
    return match ? match[1] : null;
  };

  // ✅ Download Image Function
  const downloadImage = async (htmlContent) => {
    const imageUrl = extractImageUrl(htmlContent);
    if (!imageUrl) {
      alert('No image found to download.');
      return;
    }
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${product || 'review'}_image.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Image download failed. Right-click the image and select "Save image as".');
    }
  };

  // ✅ Render Article with Image
  const renderArticle = (htmlContent) => {
    if (!htmlContent) return { image: null, content: htmlContent };
    const imgSrc = extractImageUrl(htmlContent);
    let cleanHtml = htmlContent.replace(/<img[^>]*>/gi, '');
    return { image: imgSrc, content: cleanHtml };
  };

  return (
    <div style={{ 
      background: dark ? '#111' : '#f5f7fa', 
      color: dark ? '#fff' : '#000',
      minHeight: '100vh',
      padding: '16px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900' }}>⚡ Ad-Killer V4</h1>
          <button onClick={() => setDark(!dark)} style={{
            fontSize: '24px',
            background: dark ? '#333' : '#ddd',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer'
          }}>{dark ? '☀️' : '🌙'}</button>
        </div>
        <p style={{ opacity: 0.7, marginBottom: '20px', fontSize: '14px' }}>
          🖼️ 2200+ Words | 📥 Download Images | 🔗 Clean Links
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="text" 
            placeholder='e.g. "Surfshark" or "Grammarly"' 
            value={product} 
            onChange={(e) => setProduct(e.target.value)}
            style={{
              padding: '16px',
              fontSize: '18px',
              borderRadius: '16px',
              border: '2px solid #ccc',
              background: dark ? '#222' : '#fff',
              color: dark ? '#fff' : '#000',
              width: '100%'
            }}
          />
          <input 
            type="url" 
            placeholder='🔗 Your Affiliate Link (Paste here)' 
            value={affiliateLink} 
            onChange={(e) => setAffiliateLink(e.target.value)}
            style={{
              padding: '16px',
              fontSize: '16px',
              borderRadius: '16px',
              border: '2px solid #ccc',
              background: dark ? '#222' : '#fff',
              color: dark ? '#fff' : '#000',
              width: '100%'
            }}
          />
          <button 
            onClick={handleGenerate} 
            disabled={loading}
            style={{
              padding: '18px',
              fontSize: '20px',
              fontWeight: 'bold',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              width: '100%'
            }}
          >
            {loading ? '⏳ Processing (2-3 mins)...' : '🔥 Kill Ads & Generate'}
          </button>
        </div>

        {campaignId && (
          <div style={{ marginTop: '20px', padding: '16px', background: dark ? '#222' : '#e0f2fe', borderRadius: '16px' }}>
            <p><strong>🆔 ID:</strong> {campaignId}</p>
            <p><strong>📡 Status:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{status}</span></p>
            <p style={{ fontSize: '12px', opacity: 0.6 }}>⏳ Long form content generate ho raha hai (2-3 min).</p>
          </div>
        )}

        {data && (
          <div style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>📥 Content Ready</h2>

            <div style={{ padding: '16px', background: dark ? '#1a1a1a' : '#fff', borderRadius: '16px', marginBottom: '16px', border: '1px solid #1DA1F2' }}>
              <h3 style={{ color: '#1DA1F2', margin: 0 }}>🐦 Twitter Thread</h3>
              <textarea rows="6" style={{ width: '100%', padding: '12px', marginTop: '10px', borderRadius: '12px', border: '1px solid #ddd', background: dark ? '#333' : '#f9f9f9', color: dark ? '#fff' : '#000', fontSize: '14px' }} readOnly value={data.twitter_thread} />
              <button onClick={() => copyText(data.twitter_thread)} style={{ marginTop: '10px', padding: '14px', background: '#1DA1F2', color: '#fff', border: 'none', borderRadius: '12px', width: '100%', fontWeight: 'bold' }}>📋 Copy Tweets</button>
            </div>

            <div style={{ padding: '16px', background: dark ? '#1a1a1a' : '#fff', borderRadius: '16px', marginBottom: '16px', border: '1px solid #FF0050' }}>
              <h3 style={{ color: '#FF0050', margin: 0 }}>🎬 Reels Script</h3>
              <textarea rows="4" style={{ width: '100%', padding: '12px', marginTop: '10px', borderRadius: '12px', border: '1px solid #ddd', background: dark ? '#333' : '#f9f9f9', color: dark ? '#fff' : '#000', fontSize: '14px' }} readOnly value={data.reels_script} />
              <button onClick={() => copyText(data.reels_script)} style={{ marginTop: '10px', padding: '14px', background: '#FF0050', color: '#fff', border: 'none', borderRadius: '12px', width: '100%', fontWeight: 'bold' }}>🎥 Copy Script</button>
            </div>

            {/* ✅ GOOGLE ARTICLE CARD (With Image Download) */}
            <div style={{ padding: '16px', background: dark ? '#1a1a1a' : '#fff', borderRadius: '16px', marginBottom: '16px', border: '1px solid #22c55e' }}>
              <h3 style={{ color: '#22c55e', margin: 0 }}>📄 Google Article (Long Form)</h3>
              
              {/* Image Display */}
              {renderArticle(data.google_article).image && (
                <>
                  <img 
                    src={renderArticle(data.google_article).image} 
                    alt={`${product} Review`} 
                    style={{ 
                      width: '100%', 
                      maxWidth: '100%', 
                      height: 'auto', 
                      borderRadius: '12px', 
                      margin: '20px 0',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }} 
                  />
                  {/* 🆕 IMAGE DOWNLOAD BUTTON */}
                  <button 
                    onClick={() => downloadImage(data.google_article)} 
                    style={{ 
                      marginBottom: '15px', 
                      padding: '10px 16px', 
                      background: '#22c55e', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    📥 Download Image
                  </button>
                </>
              )}
              
              {/* HTML Content (Without Image) */}
              <div 
                style={{ 
                  padding: '12px', 
                  marginTop: '10px', 
                  borderRadius: '12px', 
                  border: '1px solid #ddd', 
                  background: dark ? '#333' : '#f9f9f9',
                  maxHeight: '500px',
                  overflow: 'auto',
                  fontSize: '14px',
                  lineHeight: '1.8'
                }}
                dangerouslySetInnerHTML={{ __html: renderArticle(data.google_article).content }}
              />
              
              <button onClick={() => copyText(data.google_article)} style={{ marginTop: '10px', padding: '14px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '12px', width: '100%', fontWeight: 'bold' }}>📋 Copy Full HTML</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: dark ? '#1a1a1a' : '#fff', borderRadius: '16px', border: '1px solid #0A66C2' }}>
                <h4 style={{ color: '#0A66C2', margin: 0, fontSize: '14px' }}>💼 LinkedIn</h4>
                <textarea rows="3" style={{ width: '100%', padding: '8px', marginTop: '8px', borderRadius: '8px', border: '1px solid #ddd', background: dark ? '#333' : '#f9f9f9', fontSize: '12px', color: dark ? '#fff' : '#000' }} readOnly value={data.linkedin_post} />
                <button onClick={() => copyText(data.linkedin_post)} style={{ marginTop: '8px', padding: '10px', background: '#0A66C2', color: '#fff', border: 'none', borderRadius: '8px', width: '100%', fontWeight: 'bold' }}>Copy</button>
              </div>
              <div style={{ padding: '12px', background: dark ? '#1a1a1a' : '#fff', borderRadius: '16px', border: '1px solid #FF4500' }}>
                <h4 style={{ color: '#FF4500', margin: 0, fontSize: '14px' }}>🔴 Reddit</h4>
                <textarea rows="3" style={{ width: '100%', padding: '8px', marginTop: '8px', borderRadius: '8px', border: '1px solid #ddd', background: dark ? '#333' : '#f9f9f9', fontSize: '12px', color: dark ? '#fff' : '#000' }} readOnly value={data.reddit_post} />
                <button onClick={() => copyText(data.reddit_post)} style={{ marginTop: '8px', padding: '10px', background: '#FF4500', color: '#fff', border: 'none', borderRadius: '8px', width: '100%', fontWeight: 'bold' }}>Copy</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
