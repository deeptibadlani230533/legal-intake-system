export default function Header({ title, children }) {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      {/* Right side content (buttons, search etc.) */}
      <div>{children}</div>
    </header>
  );
}
