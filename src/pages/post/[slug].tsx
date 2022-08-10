import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import commonStyles from '../../styles/common.module.scss';
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
  return <h1>slug do post testando</h1>;
}

export const getStaticPaths: GetStaticPaths = async => {
  // const prismic = getPrismicClient({});
  // const posts = await prismic.getByType();

  // TODO

  return {
    paths: [],
    fallback: 'blocking', // can also be true or 'blocking' or false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', `${params.slug}`);

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: {
        heading: response.data.content[0].heading,
        body: {
          text: response.data.content[0].body,
        },
      },
    },
  };

  return {
    props: { post },
  };
};
