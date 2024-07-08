import Link from 'next/link';
import "../styles/global.css"
import Auth from './login';
Auth

export default function Home() {
  return (
    <div>
      <Auth/>
    </div>
  );
}
