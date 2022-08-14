import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { useState } from 'react';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiUser, FiCalendar } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination);

  async function AddPost(): Promise<void> {
    const newpost = [];
    const postResult = await fetch(posts.next_page).then(response =>
      response.json()
    );

    postResult.results.forEach(post => {
      newpost.push({
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      });
    });

    setPosts({
      next_page: postResult.next_page,
      results: [...posts.results, ...newpost],
    });
  }

  return (
    <main className={styles.Container}>
      <div>
        <header className={styles.image}>
          <Image src="/images/Logo.svg" alt="logo" width={372} height={80} />
        </header>

        {posts.results.map(post => {
          const data = format(
            new Date(post.first_publication_date),
            'dd MMM yyyy',
            {
              locale: ptBR,
            }
          );
          return (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <div className={styles.post} key={post.uid}>
                <h1>{post.data.title}</h1>
                <h2>{post.data.subtitle}</h2>
                <ul>
                  <li>
                    <>
                      <FiCalendar style={{ marginRight: 10 }} />
                      {data}
                    </>
                  </li>
                  <li>
                    <>
                      <FiUser style={{ marginRight: 10 }} />
                      {post.data.author}
                    </>
                  </li>
                </ul>
              </div>
            </Link>
          );
        })}

        {posts.next_page !== null ? (
          <button type="button" onClick={AddPost}>
            Carregar mais posts
          </button>
        ) : null}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({
    req: { url: process.env.PRISMIC_API_ENDPOINT },
  });

  const postsResponse = await prismic.getByType('post', {
    pageSize: 1,
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: [],
  };

  postsResponse.results.forEach(post => {
    postsPagination.results.push({
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    });
  });

  return {
    props: { postsPagination },
    revalidate: 3600,
  };
};
