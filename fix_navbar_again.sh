#!/bin/bash
sed -i '' 's/rounded-\[3rem\] flex items-center justify-between/rounded-\[3rem\] flex items-center justify-between relative/g' src/components/Navbar.tsx

# Replace the entire Mobile Spacer and Logo Section
cat << 'INNER_EOF' > replacement.txt
          {/* LEFT SIDE (Logo + Desktop Text) */}
          <div className="flex items-center gap-3 z-20">
            <Link href="/" onClick={handleLogoClick}>
              <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[var(--ks-kinpaku)] shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:border-white transition-all duration-300">
                <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
              </div>
            </Link>
            <Link href="/" onClick={handleLogoClick} className="hidden xl:block">
              <span className="text-white font-black font-condensed uppercase tracking-wider text-3xl hover:text-[var(--ks-kinpaku)] transition-colors">
                Yarımada FK
              </span>
            </Link>
          </div>

          {/* MOBILE CENTER TEXT */}
          <Link href="/" onClick={handleLogoClick} className="xl:hidden absolute left-1/2 -translate-x-1/2 z-10 w-auto text-center">
            <span className="text-white font-black font-condensed uppercase tracking-wider text-2xl sm:text-3xl whitespace-nowrap hover:text-[var(--ks-kinpaku)] transition-colors">
              Yarımada FK
            </span>
          </Link>
INNER_EOF

# We need to replace lines 44 to 53 in Navbar.tsx
# Using ed or just node script is safer for multiline replacement.
