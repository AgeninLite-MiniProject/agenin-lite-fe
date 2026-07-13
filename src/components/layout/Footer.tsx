import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto flex flex-col md:flex-row min-h-14 max-w-7xl items-center justify-between px-6 py-4 md:py-0 gap-4 md:gap-0 text-[13px] font-medium text-slate-400">
        {/* LEFT — Brand Logo */}
        <div className="flex-1 w-full md:w-auto text-center md:text-left">
          <Link to="/dashboard" className="inline-flex items-center">
            <img
              src="/src/assets/ageninliteBlue.webp"
              alt="AgeninLite Logo"
              className="h-5 opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>

        {/* CENTER — Names */}
        <div className="flex-1 text-center">
          Idham Naufal Purwanto | Naufal Yoga Pratama | Edi Wicoro
        </div>

        {/* RIGHT — Copyright */}
        <div className="flex-1 w-full md:w-auto text-center md:text-right">
          @2026, ageninlite-jdt17. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
