const jwt = require('jsonwebtoken');

// এডিট-প্রয়োজনীয় (write) রুটগুলো এই মিডলওয়্যার দিয়ে সুরক্ষিত।
// শুধু সঠিক এডমিন পাসওয়ার্ড দিয়ে লগইন করে পাওয়া টোকেন থাকলেই এগোতে দেয়া হয়।
// পড়া (GET) রুটগুলোতে এটি ব্যবহার করা হয় না — সবাই দেখতে পারে।
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'এডিট করতে লগইন করা প্রয়োজন' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || !payload.admin) throw new Error('invalid');
    next();
  } catch (e) {
    return res.status(401).json({ error: 'সেশনের মেয়াদ শেষ হয়ে গেছে — আবার লগইন করুন' });
  }
}

module.exports = requireAdmin;
