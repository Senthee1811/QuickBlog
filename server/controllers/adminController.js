import jwt from "jsonwebtoken"; 
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Incoming email:", email);
    console.log("🔐 Incoming password:", password);
    console.log("🔐 ENV email:", process.env.ADMIN_EMAIL);
    console.log("🔐 ENV password:", process.env.ADMIN_PASSWORD);

    console.log("✅ email match:", email === process.env.ADMIN_EMAIL);
    console.log("✅ password match:", password === process.env.ADMIN_PASSWORD);

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    return res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
