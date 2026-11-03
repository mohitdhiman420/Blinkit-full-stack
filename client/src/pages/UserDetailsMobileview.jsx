import React from "react";
import UserMenu from "../component/UserMenu";

function UserDetailsMobileview() {
  return (
    <section>
      <div className="container mx-auto px-4 py-4">
          <div className="text-2xl font-bold text-right px-3" onClick={() => window.history.back()}>x</div>
        <UserMenu />
      </div>
    </section>
  );
}

export default UserDetailsMobileview;
