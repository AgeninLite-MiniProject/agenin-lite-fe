import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* LEFT — Brand */}
        <Link
          to="/dashboard"
          className="font-heading text-sm font-bold text-foreground"
        >
          AgeninLite
        </Link>

        {/* CENTER — Links */}
        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact Us
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Help Center
          </a>
        </nav>

        {/* RIGHT — Copyright */}
        <p className="text-sm text-muted-foreground">
          © 2026 AgeninLite. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
