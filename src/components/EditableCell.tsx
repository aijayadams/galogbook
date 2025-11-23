'use client';

import { useState, useRef, useEffect } from 'react';

interface EditableCellProps {
  value: string | number | undefined;
  onSave: (value: string | number) => void;
  type?: 'text' | 'number' | 'date' | 'time';
  className?: string;
  placeholder?: string;
  step?: string;
  min?: string;
}

export default function EditableCell({
  value,
  onSave,
  type = 'text',
  className = '',
  placeholder = '-',
  step,
  min
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditValue(value?.toString() || '');
      inputRef.current?.focus();
    }
  }, [isEditing, value]);

  const handleSave = () => {
    if (type === 'number') {
      const numValue = editValue ? parseFloat(editValue) : 0;
      onSave(numValue);
    } else {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      handleSave();
    }, 100);
  };

  const displayValue = value !== undefined && value !== null && value !== ''
    ? (type === 'number' && typeof value === 'number' ? value.toFixed(1) : value.toString())
    : placeholder;

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        step={step}
        min={min}
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded transition-colors"
    >
      {displayValue}
    </button>
  );
}
