export const fetchVimeoVideos = async () => {
  const response = await fetch("https://api.vimeo.com/me/videos", {
    headers: {
      Authorization: "Bearer 9409ffe226c0593229ae2a92893a0f78",
      "Content-Type": "application/json"
    }
  });
  const json = await response.json();
  return json.data;
};
