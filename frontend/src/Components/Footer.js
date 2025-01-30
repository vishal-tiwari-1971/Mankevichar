import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 ">
        <hr/>
      <div className="container mx-auto flex flex-col items-center justify-center text-center space-y-4">
        {/* Navigation Links */}
        <nav className="flex space-x-6 mt-2">
          <a href="/" className="hover:text-gray-400">Home</a>
          <a href="/journal" className="hover:text-gray-400">My Journal</a>
          <a href="/about" className="hover:text-gray-400">About</a>
          <a href="/contact" className="hover:text-gray-400">Contact</a>
        </nav>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white">
            <FaFacebook size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaInstagram size={20} />
          </a>
        </div>

        {/* Copyright Text */}
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Journalify. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
