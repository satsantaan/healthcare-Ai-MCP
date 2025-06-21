// Simple authentication endpoint for Vercel deployment
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Simple demo authentication (replace with real auth in production)
  if (username === 'admin' && password === 'admin123456') {
    // Generate a simple demo token (use proper JWT in production)
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          username,
          role: 'admin',
          permissions: ['read', 'write', 'admin']
        }
      },
      message: 'Login successful'
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      message: 'Please check your username and password'
    });
  }
}
