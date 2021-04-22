import Link from "next/link"
import styles from "../../styles/Home.module.scss" ;
import {useRouter} from "next/router"
import { useState } from "react";



async function getPost(slug : string) {
  const res = await fetch(
    `${process.env.BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${process.env.CONTENT_API_KEY}&fields=title,slug,html`
  ).then((res) => res.json())
  const posts = res.posts
  return posts[0]
}
//1.helloWorld - on first req --> Ghost CMS call is made
//2.helloWorld - on further request.. --> filesystem call is made (cached)
export const getStaticPaths = () => {
    //paths --> slugs which are allowed
    //fallback --> wait ... then fire up getstatic paths again 
    return {
        paths : [] ,
        fallback: true 
    }
}
//Ghost CMS request
export const getStaticProps = async ({params}) => {
    const post = await getPost(params.slug) ;
    return {
    props : {post},
    revalidate: 120
  }
}
type Post = {
    title: string ,
    html: string,
    slug: string
}
const Post: React.FC<{post: Post}> = (props) => {
    const router = useRouter() ;
    const {post} = props 

    const [enableLoadComments, setenableLoadComments] = useState<boolean>(true)
    if(router.isFallback) {
        return <h2>Loading...</h2>
    }
    function loadComments() {
        setenableLoadComments(false)
        ;(window as any).disqus_config = function () {
            this.page.url = window.location.href ;
            this.page.identifier = post.slug ;
        }
        const script = document.createElement('script')
        script.src  = "https://next-ghost-cms-blog.disqus.com/embed.js"
        script.setAttribute('data-timestamp', Date.now().toString())
        document.body.appendChild(script)
    }

    return (
        <div className = {styles.container}>
            <Link href = "/">
                <a href="">Go Back</a>
            </Link>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML ={{__html: post.html }} ></div>
      {enableLoadComments && ( <p onClick = {loadComments}>Load Comments</p>)} 
        <div id = "disqus_thread"> </div>
        </div>
    )
}
export default Post