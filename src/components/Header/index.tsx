import Link from 'next/link';
import Image from 'next/image';

export default function Header(): JSX.Element {
  return (
    <div>
      <Link href="/">
        <a>
          <Image
            src="/../public/images/Logo.svg"
            alt="logo"
            width={372}
            height={80}
          />
        </a>
      </Link>
    </div>
  );
}
