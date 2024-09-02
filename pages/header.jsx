// components/Header.js
import Image from 'next/image';
import logo from '../public/logo.png'; // Substitua 'logo.png' pelo caminho real da sua logo

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <Image src={logo} alt="Logo" height={100} style={styles.logo} />
        <span style={styles.text}>Hospital Militar de Área de Manaus</span>
      </div>
    </header>
  );
};

const styles = {
  header: {
    width: '100%',
    height: '100px',
    backgroundColor: '#00510f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px 10px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    marginRight: '10px',
  },
  text: {
    fontSize: '24px',
    color: 'white',
  },
};

export default Header;
