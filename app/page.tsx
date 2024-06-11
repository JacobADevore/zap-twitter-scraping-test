export default function Home() {
  const createPost = async () => {
    "use server";

    const access_token = "";

    try {
      const post_tweet = await (
        await fetch(`https://api.twitter.com/2/tweets`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ text: "testing 123" }),
        })
      ).json();

      console.log(post_tweet);
    } catch (e) {
      console.log("posting tweet error", e);
      throw new Error("Error posting tweet");
    }
  };

  return (
    <form action={createPost}>
      <button type="submit">Generate new auth tokens</button>
    </form>
  );
}
