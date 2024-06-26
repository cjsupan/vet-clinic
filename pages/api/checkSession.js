import { getSession } from "next-auth/react";

const CheckSession = async (req, res) => {
  const session = await getSession({ req });

  if (session) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
};

export default CheckSession;
