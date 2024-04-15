import { getPost, getPosts } from "../api/post";

export const singlePageLoader = async ({ request, params }) => {
  const res = await getPost(params.id);

  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];

  const res = await getPosts(query);

  return res.data;
};
