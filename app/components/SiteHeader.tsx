import Image from 'next/image';
import Link from 'next/link';

const navLinkStyle = {
  color: '#cfd6cb',
  textDecoration: 'none',
};

export function SiteHeader() {
  return (
    <header
      className='site-header'
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '25px 40px',
        borderBottom: '1px solid #2a2d35',
      }}
    >
      <Image
        src='/goblin-icon.png'
        alt='GoblinTechUK logo'
        width={256}
        height={171}
        style={{
          height: '70px',
          width: 'auto',
        }}
      />

      <nav className='site-nav' style={{ display: 'flex', gap: '25px' }}>
        <Link href='/' style={navLinkStyle}>
          Home
        </Link>
        <Link href='/#deals' style={navLinkStyle}>
          Deals
        </Link>
        <Link href='/#about' style={navLinkStyle}>
          About
        </Link>
      </nav>
    </header>
  );
}
