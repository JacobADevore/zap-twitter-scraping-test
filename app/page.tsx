import { generate, count } from "random-words";
import { db } from "./db";
import getMentions from "./utils/getMentions";
import Link from "next/link";
const handle = "@not_zap_xyz";
// const handle = "@POTUS";
const seconds_to_run = 5;
let firstPhrase;
let lastPhrase;

export default async function Home() {
  const createPost = async () => {
    "use server";

    let errors = 0;
    let created = 0;
    let startTime: Date;

    startTime = new Date(Date.now());

    // const userInfo = await db.account.findUnique({
    //   where: {
    //     provider_providerAccountId: {
    //       provider: "twitter",
    //       providerAccountId: "1801323575191711744",
    //     },
    //   },
    //   include: {
    //     user: true,
    //   },
    // });

    // console.log("token", userInfo?.access_token);

    // const post_tweet = await (
    //   await fetch(`http://localhost:3002/tweet`, {
    //     headers: {
    //       Authorization: `Bearer ${userInfo?.access_token}`,
    //       "Content-Type": "application/json",
    //     },
    //     method: "POST",
    //     body: JSON.stringify({ text: "xd " }),
    //   })
    // ).json();

    // console.log(post_tweet);

    // return;

    // console.log("posttweet", post_tweet);
    // if (post_tweet?.status) {
    //   console.log("haha error");
    // }
    // return;

    const testToken =
      "bHdIRHBWVlZ4NmJLY0lWWmJ0MGtibUZIZldPV3 UteUxMV0RiMjZrbEh6bWhjOjE3MTgyMDYzNTUwNTQ6MToxOmF0OjE";

    const provider_ids = [
      "1801638253893672960",
      "1801638636577792000",
      "1801638989377523712",
      "1801639338238722048",
      "1801640069196877824",
      "1801640444159307776",
      "1801640844467810304",
      "1801641179223650304",
      "1801642139832475648",
      "1801642390056267776",
      "1801666974042206208",
      "1801667330243489793",
      "1801667730535231489",
      "1801668195146682368",
      "1801668495949578241",
      "1801668103757058048",
      "1801672902418239489",
      "1801673236884688896",
      "1801673612933378048",
      "1801674069533724672",
      "1801674417002414080",
      "1801674927046610944",
      "1801675214444470272",
      "1801672058515902465",
      "1801672592731811840",
      "1801673095066886144",
      "1801673442111918080",
      "1801674121656283136",
      "1801674797199290368",
      "1801675154830868480",
    ];

    const date = "2024-06-13T17:00:44.000Z";

    // const createdPosts = await db.xPostTest.findMany({
    //   where: {
    //     created_at: {
    //       gt: date,
    //     },
    //   },
    // });

    // const storedPosts = await db.xPost.findMany({
    //   where: {
    //     created_at: {
    //       gt: date,
    //     },
    //   },
    // });

    // console.log("stored posts: ", storedPosts.length);
    // console.log("created Posts: ", createdPosts.length);
    // return;

    //code for individual post every second
    // const generateAndPost = async () => {
    //   let randomWords = generate({ min: 5, max: 10 }) as string[];
    //   randomWords.splice(
    //     Math.floor(Math.random() * randomWords.length),
    //     0,
    //     handle
    //   );
    //   await postToTwitter("1801658775146766336", randomWords);
    // };

    // Show links for missing words

    // const start = new Date("2024-06-13T20:59:47.452Z");
    // const end = new Date("2024-06-13T20:37:49.344Z");

    // const lessThan = "2024-06-13T20:37:49.344Z";

    // const realWordObjects = await db.xPost.findMany({
    //   where: {
    //     created_at: {
    //       gte: start,
    //     },
    //   },
    //   select: {
    //     post_text: true,
    //   },
    // });

    // const fakeWordObjects = await db.xPostTest.findMany({
    //   where: {
    //     created_at: {
    //       gte: start,
    //     },
    //   },
    //   select: {
    //     post_text: true,
    //   },
    // });

    // console.log("fakes", fakeWordObjects.length);

    // const realWords = realWordObjects.map((word) => word.post_text);
    // const fakeWords = fakeWordObjects.map((word) => word.post_text);

    // const unFoundWords = fakeWords.filter(
    //   (word) => !realWords.some((realWord) => realWord === word)
    // );
    // console.log("unfound: ", unFoundWords.length);

    // // console.log(unFoundWords);

    // const linkArr: string[] = [];

    // unFoundWords.forEach((word) => {
    //   const encodedWord = encodeURIComponent(word);
    //   const url = `https://x.com/search?q=${encodedWord}&src=typed_query&f=live`;
    //   linkArr.push(url);
    // });

    // console.log(linkArr);

    const generateAndPost = async () => {
      provider_ids.forEach(async (id) => {
        let randomWords = generate({ min: 5, max: 10 }) as string[];
        randomWords.splice(
          Math.floor(Math.random() * randomWords.length),
          0,
          handle
        );
        await postToTwitter(id, randomWords);
      });
    };

    const postToTwitter = async (id: string, randomWords: string[]) => {
      let flatWords = randomWords.join(" ");

      const userInfo = await db.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: "twitter",
            providerAccountId: id,
          },
        },
        include: {
          user: true,
        },
      });
      // console.log("userInfo", userInfo);
      const token = userInfo?.access_token;
      const username = userInfo?.user.id;

      try {
        const post_tweet = await (
          await fetch(`http://localhost:3002/tweet`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ text: flatWords }),
          })
        ).json();

        console.log("post_tweet", post_tweet);

        if (post_tweet.success === false) {
          errors++;
          console.log("error posting");
        } else {
          if (!username) {
            return;
          }
          created++;
          const post = await db.xPostTest.create({
            data: {
              username: username,
              post_text: flatWords,
              created_at: new Date(Date.now()),
            },
          });
        }

        // if (post_tweet?.status) {
        //   console.log("error posting");
        //   errors++;
        // } else {
        //   created++;

        // }

        // console.log("post", post);
      } catch (e) {
        console.log("posting tweet error", e);
        throw new Error("Error posting tweet");
      }
    };

    async function createBunch() {
      const promises = [];
      for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 50; y++) {
          let randomWords = generate({ min: 5, max: 10 }) as string[];
          randomWords.splice(
            Math.floor(Math.random() * randomWords.length),
            0,
            handle
          );
          promises.push(postToTwitter(provider_ids[x], randomWords));
          // await postToTwitter(provider_ids[x], randomWords);
        }
      }
      await Promise.all(promises);
      console.log("errors: ", errors);
      console.log("created: ", created);
      console.log("time: ", startTime);
    }

    // await createBunch();

    await generateAndPost();

    const interval = setInterval(generateAndPost, 1000);

    setTimeout(() => {
      clearInterval(interval);
      console.log("errors: ", errors);
      console.log("created: ", created);
      console.log("time: ", startTime);
    }, seconds_to_run * 1000);
  };

  type GetMentionsParams = {
    secret: string;
  };

  type TweetType = {
    id: string;
    author_id: string;
    text: string;
    created_at: Date;
  };

  const NOT_ZAP_X_ACCOUNT_ID = "1800598898152472576";

  async function getMentions() {
    console.log("running");
    const url = `https://api.twitter.com/2/users/${NOT_ZAP_X_ACCOUNT_ID}/mentions?max_results=100&expansions=author_id&tweet.fields=created_at`;

    try {
      const result = await (
        await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          },
        })
      ).json();
      console.log("result", result);

      if (!result || !result.data || !result.data.length) {
        return false;
      }

      const unfilteredTweets = result.data;

      console.log("unfiltered tweets", unfilteredTweets.length);

      const tweetIds = unfilteredTweets.map((tweet: TweetType) => tweet.id);
      const existingPosts = await db.xPost.findMany({
        where: {
          id: { in: tweetIds },
        },
      });
      const tweets = unfilteredTweets.filter(
        (tweet: TweetType) =>
          !existingPosts.find((post: any) => post.id === tweet.id)
      );

      console.log("filtered tweets", tweets.length);

      const promiseArr = tweets.map((tweet: TweetType) =>
        db.xPost.create({
          data: {
            id: tweet.id,
            username: tweet.author_id,
            post_text: tweet.text,
            posted_at: tweet.created_at,
          },
        })
      );

      await db.$transaction(promiseArr);
    } catch (error) {
      console.log("error", error);
    }
  }

  // await getMentions();

  // setInterval(async () => {
  //   await getMentions();
  // }, 2000);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1em",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2em",
        }}
        action={createPost}
      >
        <button className="bg-white text-black border p-1" type="submit">
          Generate New Posts
        </button>
        <Link href="/api/auth/signin">Go to auth</Link>
      </form>
    </div>
  );
}
