import { Button, Text } from "@mantine/core";
import Image from "next/image";

const ErrorPage = ({ statusCode }) => {
  return (
    <div className="errorPage">
      <div className="error-container">
        <Image src="/404.svg" alt="error" width={500} height={500} />
        <Text fz="xl" fw={500} color="white">
          Page not found
        </Text>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    </div>
  );
};

export default ErrorPage;

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
