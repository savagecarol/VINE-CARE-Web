 
import React, { useEffect } from 'react';

export default function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 bg-dark text-green px-5 py-3 rounded-xl text-sm z-50 shadow-xl animate-bounce">
      {msg}
    </div>
  );
}