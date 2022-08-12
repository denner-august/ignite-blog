import Image from 'next/image';
import Link from 'next/link';

export default function Header(): JSX.Element {
  return (
    <Link href="/">
      <Image
        src="/../public/images/Logo.svg"
        alt="logo"
        width={372}
        height={80}
      />
    </Link>
  );
}
