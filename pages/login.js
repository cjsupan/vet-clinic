import React, { useEffect, useState } from "react";
import Head from "next/head";
import { signIn, useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { LoadingOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";

import { Text, Button, Input, Divider, ActionIcon } from "@mantine/core";

const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    Email: "",
    Password: "",
  };
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (data) => {
    const { Email, Password } = data;

    try {
      setLoading(true);
      const loginRes = await signIn("credentials", {
        redirect: false,
        Email,
        Password,
      });
      if (loginRes.error) {
        setError("Password", {
          type: "manual",
          message: "Email or Password is incorrect",
        });
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      console.log("authenticated");
      router.push("/");
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="login">
        <div className="login-container">
          <Text align="center" fw={600} size={"xl"} component="h1">
            Sign in
          </Text>
          <Form
            onFinish={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <Form.Item>
              <Input
                autoComplete="off"
                {...register("Email", {
                  required: "Email is a required field",
                })}
                placeholder="Email"
                size="md"
              />

              {errors.Email && (
                <span className="text-red">{errors.Email.message} </span>
              )}
            </Form.Item>
            <Form.Item>
              <Input
                autoComplete="off"
                {...register("Password", {
                  required: "Password is a required field",
                })}
                placeholder="Password"
                type="password"
                size="md"
              />

              {errors.Password && (
                <span className="text-red">{errors.Password.message} </span>
              )}
            </Form.Item>
            <Button
              type="submit"
              style={{ backgroundColor: "#356cb1" }}
              fullWidth
              loading={loading}
            >
              Sign in
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log("session", session);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
