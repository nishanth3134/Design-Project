export default function adminAuth(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!process.env.ADMIN_KEY) return res.status(500).json({ error: 'Admin not configured' });
  if (key && key === process.env.ADMIN_KEY) return next();
  return res.status(401).json({ error: 'Unauthorized: missing or invalid admin key' });
}
