import Image from 'next/image';
import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import logo from '../../public/Logo.svg';

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

export default function Home(props: HomeProps): JSX.Element {
  return (
    <div className={styles.Container}>
      <Image src={logo} alt="Picture of the author" width={372} height={80} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({
    req: { url: process.env.PRISMIC_API_ENDPOINT },
  });

  const postsResponse = await prismic.getByType('post');

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
    };
  });

  return {
    props: posts,
  };
};
