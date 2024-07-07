import User from "../models/User.js";

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const details = await User.find({ username, password });
    if (details.length > 0) {
      const sessionId = new Date().getTime().toString();
      return res.json({
        success: true,
        message: "Login Successful",
        sessionId,
        name: details[0].name,
        userId: details[0]._id,
      });
    }
    return res.json({ success: false, message: "Invalid credentials" });
  } catch (e) {
    console.error(e.message);
    return res.json({ success: false, message: "An error occurred" });
  }
};

const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const details = await User.find({ username });
    if (details.length > 0) {
      return res.json({
        success: false,
        message: "Account already exists",
      });
    }

    const result = await User.insertMany({ name, username, password });
    return res.json({ success: true, message: "Registered Successfully" });
  } catch (e) {
    console.error(e.message);
    return res.json({ success: false, message: "An error occurred" });
  }
};

const getUsers = async (req, res) => {
  try {
    const results = await User.find();
    return res.json({ success: true, title: "People", data: results });
  } catch (e) {
    console.error(e.message);
    return res.json({ success: false, message: "An error occurred" });
  }
};

export { login, register, getUsers };
