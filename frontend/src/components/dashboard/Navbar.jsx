import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 shadow-sm">

      {/* Search */}

      <div className="relative w-[420px]">

        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search inventory, reports, users..."
          className="
          w-full
          rounded-2xl
          border
          border-slate-300
          bg-slate-50
          py-3
          pl-14
          pr-5
          text-sm
          outline-none
          transition-all
          duration-300
          focus:border-green-500
          focus:bg-white
          focus:ring-4
          focus:ring-green-100
          "
        />

      </div>

      {/* Right Section */}

      <div className="flex items-center gap-6">

        {/* Notification */}

        <button
          className="
          relative
          rounded-xl
          p-3
          transition
          duration-300
          hover:bg-slate-100
          "
        >

          <Bell
            size={22}
            className="text-slate-600"
          />

          <span
            className="
            absolute
            right-3
            top-3
            h-2.5
            w-2.5
            rounded-full
            bg-red-500
            ring-2
            ring-white
            "
          />

        </button>

        {/* User */}

        <div
          className="
          flex
          items-center
          gap-3
          rounded-2xl
          px-3
          py-2
          transition
          duration-300
          hover:bg-slate-100
          cursor-pointer
          "
        >

          <UserCircle
            size={42}
            className="text-green-600"
          />

          <div>

            <h4 className="font-semibold text-slate-800">
              Admin
            </h4>

            <p className="text-sm text-slate-500">
              Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;