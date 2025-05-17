import React from "react";

export default function Footer() {
  return (
    <main>
      {/* Section Footer */}
      <footer className="footer footer-center bg-base-300 p-4 text-base-content">
        <aside>
          <p className="text-center text-sm sm:text-base">
            Copyright © {new Date().getFullYear()} - All rights reserved by{" "}
            <span className="font-bold">Irvan Sandy</span>
          </p>
        </aside>
      </footer>
      {/* End section footer */}
    </main>
  );
}
