export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Yarımada FK. Bütün hüquqlar qorunur.
          </p>
        </div>
        <div className="flex space-x-4 text-sm">
          <a href="#" className="hover:text-gray-300">Facebook</a>
          <a href="#" className="hover:text-gray-300">Instagram</a>
          <a href="#" className="hover:text-gray-300">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
