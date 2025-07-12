import React, { useEffect, useState } from 'react';

function PointerLockHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimeout = setTimeout(() => setVisible(true), 300);   // délai avant apparition
    const hideTimeout = setTimeout(() => setVisible(false), 7000); // délai avant disparition

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <div
      className={`
        fixed top-1/2 left-1/2 z-30
        transform -translate-x-1/2 -translate-y-1/2
        pointer-events-none text-center select-none
        transition-all duration-[2000ms] ease-out
        ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
      `}
    >
      <div className="px-6 py-3 rounded-xl backdrop-blur-md bg-black/30 text-white text-xl shadow-xl border border-white/20">
        <p className="italic tracking-wide text-white/90 drop-shadow">
           Quelque part sur le web... quelques idées et une jungle...<br />
           À tout moment, double-clic pour explorer les alentours, reprendre la route ou basculer entre jour et nuit… <br />
           Échap pour revenir.
        </p>
      </div>
    </div>
  );
}

export default PointerLockHint;


