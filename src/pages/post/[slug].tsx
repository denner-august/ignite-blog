/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Loading } from '../../components/loading';

import styles from './post.module.scss';

import { getPrismicClient } from '../../services/prismic';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  function CalcularText(): number {
    const totalWords = post.data.content.reduce((preve, posts) => {
      preve += posts.heading.split(' ').length;

      const words = posts.body.map(content => content.text.split(' ').length);
      words.map(word => (preve += word));
      return preve;
    }, 0);

    return Math.ceil(totalWords / 200);
  }

  if (router.isFallback === true) {
    return <Loading />;
  }

  return (
    <main className={styles.Container}>
      <Link href="/">
        <header>
          <Image
            src="/images/Logo.svg"
            height={26.63}
            width={238.62}
            alt="logo"
          />
        </header>
      </Link>

      <div className={styles.banner}>
        <Image
          src="https://images.prismic.io/blog-project-ignite/378199ed-58b9-4ed6-89cf-3639e9fc56cf_Banner.png?auto=compress"
          alt="banner"
          height={400}
          width={1440}
        />
      </div>

      <section>
        <h1>{post.data.title}</h1>

        <ul>
          <li>
            <>
              <FiCalendar style={{ marginRight: 10 }} />
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </>
          </li>
          <li>
            <>
              <FiUser style={{ marginRight: 10 }} />
              {post.data.author}
            </>
          </li>

          <li>
            <>
              <FiUser style={{ marginRight: 10 }} />
              <p>{CalcularText()} min</p>
            </>
          </li>
        </ul>

        {post.data.content.map(conteudo => {
          return (
            <article key={conteudo.heading}>
              <h1>{conteudo.heading}</h1>
              <p>{conteudo.body.map(item => item.text)}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('post');

  const slug = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths: slug,
    fallback: true, // can also be true or 'blocking' or false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', `${params.slug}`);
  return {
    props: { post: response },
  };
};
