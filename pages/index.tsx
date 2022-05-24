import Head from 'next/head';
import styles from "../styles/Home.module.scss";
import Link from "next/link";

async function getPosts() {
  const res = await fetch(
    `${process.env.BLOG_URL}/ghost/api/v3/content/posts/?key=${process.env.CONTENT_API_KEY}&fields=title,slug,custom_excerpt`
  ).then((res) => res.json())
  const posts = res.posts
  return posts
}

export const getStaticProps = async ({ params }) => {
  const posts = await getPosts();
  console.log(posts);

  return {
    props: { posts },
    revalidate: 120
  }
}

type Post = {
  title: string;
  slug: string;
}

const Home: React.FC<{ posts: Post[] }> = (props) => {
  const { posts } = props
  return (
    <div className={styles.container}>
      <Head>
        <title> Divyanshu's Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className={styles.title}>Say Hello to My Blog.</h2>
      <main className={styles.main}>
        <ol>
          {
            posts.map((post, index) => (
              <li key={index}>
                <Link href="/posts/[slug]" as={`/posts/${post.slug}`} ><a>{post.title} </a></Link>
              </li>
            ))
          }
        </ol>
      </main>


    </div>
  )
}
export default Home;