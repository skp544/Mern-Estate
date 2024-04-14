import { getPost } from "../api/post";

export const singlePageLoader = async ({ request, params }) => {
  const res = await getPost(params.id);

  return res.data;
};
