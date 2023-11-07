import { signIn } from "next-auth/react";

const loginUser = async (Email, password) => {
  const res = await signIn("credentials", {
    redirect: false,
    Email,
    password,
  });

  return res;
};

export default loginUser;
