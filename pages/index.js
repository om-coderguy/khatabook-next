import Link from 'next/link';
import "../styles/globals.css"
import Auth from './login';
Auth

export default function Home() {
  return (
    <div>
      <Auth/>
    </div>
  );
}
