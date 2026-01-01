import React, { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  onChange: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [displayOtp, setDisplayOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // FIX: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout for browser compatibility.
  const timers = useRef<(ReturnType<typeof setTimeout> | undefined)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    return () => {
      timers.current.forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  const handleValueChange = (newOtp: string[]) => {
    setOtp(newOtp);
    onChange(newOtp.join(''));
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    handleValueChange(newOtp);

    const newDisplayOtp = [...displayOtp];
    newDisplayOtp[index] = value.substring(value.length - 1);
    setDisplayOtp(newDisplayOtp);

    if (timers.current[index]) {
      clearTimeout(timers.current[index]);
    }

    if (newDisplayOtp[index]) {
      timers.current[index] = setTimeout(() => {
        setDisplayOtp(prev => {
          const updatedDisplay = [...prev];
          updatedDisplay[index] = '*';
          return updatedDisplay;
        });
      }, 1000);
    }
    
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (timers.current[index]) {
      clearTimeout(timers.current[index]);
    }

    if (e.key === 'Backspace') {
      const newDisplayOtp = [...displayOtp];
      newDisplayOtp[index] = '';
      setDisplayOtp(newDisplayOtp);

      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (pasteData) {
      const newOtp = Array(length).fill('');
      const newDisplayOtp = Array(length).fill('');
      
      timers.current.forEach(timer => {
        if (timer) clearTimeout(timer);
      });

      pasteData.split('').forEach((char, index) => {
        if (index < length) {
          newOtp[index] = char;
          newDisplayOtp[index] = char;
          
          timers.current[index] = setTimeout(() => {
            setDisplayOtp(prev => {
              const updatedDisplay = [...prev];
              updatedDisplay[index] = '*';
              return updatedDisplay;
            });
          }, 1000);
        }
      });
      
      setOtp(newOtp);
      setDisplayOtp(newDisplayOtp);
      onChange(newOtp.join(''));
      
      const nextFocusIndex = Math.min(pasteData.length, length - 1);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-4" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={el => {inputRefs.current[index] = el}}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={displayOtp[index]}
          onChange={e => handleChange(index, e)}
          onKeyDown={e => handleKeyDown(index, e)}
          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
        />
      ))}
    </div>
  );
};

export default OtpInput;