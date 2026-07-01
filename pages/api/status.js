export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const response = await fetch(`${process.env.RAILWAY_URL}/api/status/${id}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
