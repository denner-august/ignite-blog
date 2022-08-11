import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Loading } from '../../components/loading';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';

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
  // deve ser calculado o tempo de leitura onde tem o texto 4 min

  const router = useRouter();

  const data = format(new Date(post.first_publication_date), 'dd MMM yyyy', {
    locale: ptBR,
  });

  function CalcularText(): number {
    const pattener = /\w+/;

    const paragrafos = post.data.content.reduce((preve, posts) => {
      preve.push(RichText.asText(posts.body));

      return preve;
    }, []);

    const quantidadeLetras = paragrafos.reduce((preve, posts) => {
      // eslint-disable-next-line no-param-reassign
      preve += posts.length;

      return preve;
    }, 0);

    const tempoParaLer = Math.floor(quantidadeLetras / 200);

    console.log(tempoParaLer);

    return tempoParaLer;
  }

  if (router.isFallback) {
    return <Loading />;
  }

  return (
    <main className={styles.Container}>
      <Link href="/">
        <header>
          <Image
            src="/../public/images/Logo.svg"
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
              {data}
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
            <div key={conteudo.heading}>
              <h1>{conteudo.heading}</h1>
              <p>{conteudo.body.map(item => item.text)}</p>
            </div>
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
    fallback: 'blocking', // can also be true or 'blocking' or false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', `${params.slug}`);

  const post = response;

  return {
    props: { post },
  };
};
