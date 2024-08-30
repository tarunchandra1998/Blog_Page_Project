import React from "react";
import Layout from "../Components/Layout/Layout";
import { useAuth } from "../context/auth";
const ViewBlogs = () => {
  const [auth, setAuth] = useAuth();
  return (
    <Layout title={"Your Blogs"}>
      <h1>Your Blogs</h1>
      <pre> {JSON.stringify(auth, null, 4)}</pre>
    </Layout>
  );
};

export default ViewBlogs;
