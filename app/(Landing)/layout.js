import "./home.css";

export default function HomeLayout({ children }) {
  return (
    <>
      {children}

      {/* Блюр знизу сторінки */}
      <div className="pointer-events-none fixed bottom-0 left-0 z-50 w-full h-[100px]">
        <div
          className="
            absolute inset-0
            backdrop-blur-xl
            bg-white/5
            [mask-image:linear-gradient(to_top,black_0%,black_30%,transparent_100%)]
          "
        />
      </div>
    </>
  )
}
