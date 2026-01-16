import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#21232A] text-white py-12 md:py-16 px-6 sm:px-10 md:px-10 lg:px-[40px]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8" style={{ textAlign: 'center' }}>
          {/* Company Info */}
          <div className="space-y-4" style={{ textAlign: 'center' }}>
            <h3 className="text-2xl font-bold text-white" style={{ textAlign: 'center' }}>Paperdot.</h3>
            <p className="text-[#D1D5DB] text-sm leading-relaxed" style={{ textAlign: 'center' }}>
              영어 논문을 문장 단위로 번역하고 이해하는 가장 쉬운 방법
            </p>
          </div>

          {/* Product */}
          <div style={{ textAlign: 'center' }}>
            <h4 className="font-semibold text-white mb-4" style={{ textAlign: 'center' }}>제품</h4>
            <ul className="space-y-2" style={{ textAlign: 'center' }}>
              <li>
                <Link
                  href="/features"
                  className="text-[#D1D5DB] hover:text-white transition-colors duration-300 text-sm"
                  style={{ textAlign: 'center' }}
                >
                  기능
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-[#D1D5DB] hover:text-white transition-colors duration-300 text-sm"
                  style={{ textAlign: 'center' }}
                >
                  가격
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="text-[#D1D5DB] hover:text-white transition-colors duration-300 text-sm"
                  style={{ textAlign: 'center' }}
                >
                  데모
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div style={{ textAlign: 'center' }}>
            <h4 className="font-semibold text-white mb-4" style={{ textAlign: 'center' }}>회사</h4>
            <ul className="space-y-2" style={{ textAlign: 'center' }}>
              <li>
                <Link
                  href="/about"
                  className="text-[#D1D5DB] hover:text-white transition-colors duration-300 text-sm"
                  style={{ textAlign: 'center' }}
                >
                  소개
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-[#D1D5DB] hover:text-white transition-colors duration-300 text-sm"
                  style={{ textAlign: 'center' }}
                >
                  블로그
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#D1D5DB] hover:text-white transition-colors duration-300 text-sm"
                  style={{ textAlign: 'center' }}
                >
                  문의
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div style={{ textAlign: 'center' }}>
            <h4 className="font-semibold text-white mb-4" style={{ textAlign: 'center' }}>법적 고지</h4>
            <ul className="space-y-2" style={{ textAlign: 'center' }}>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#D1D5DB] hover:text-white transition-colors duration-300 text-sm"
                  style={{ textAlign: 'center' }}
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[#D1D5DB] hover:text-white transition-colors duration-300 text-sm"
                  style={{ textAlign: 'center' }}
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-[#D1D5DB] hover:text-white transition-colors duration-300 text-sm"
                  style={{ textAlign: 'center' }}
                >
                  쿠키 정책
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#474952] pt-8 text-center">
          <p className="text-[#D1D5DB] text-sm">
            © {new Date().getFullYear()} Paperdot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
