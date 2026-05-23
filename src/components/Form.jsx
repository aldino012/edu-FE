import React from "react";
import Button from "./Button";

/**
 * 1. Komponen Form Input
 */
export const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  accept,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full mb-5 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="font-bold text-slate-700 ml-2 tracking-wide"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Color */}
      {type === "color" ? (
        <div className="flex items-center gap-4">
          {/* Preview Warna */}
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-[3px] border-slate-200 shadow-sm flex-shrink-0 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <input
              type="color"
              id={`${name}-picker`}
              name={name}
              value={value || "#000000"}
              onChange={onChange}
              className="absolute -inset-2 w-24 h-24 cursor-pointer"
            />
          </div>

          {/* Input Hex */}
          <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder="#000000"
            required={required}
            className="w-full px-5 py-4 rounded-2xl border-[3px] border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-700 bg-white font-bold uppercase tracking-widest"
            {...props}
          />
        </div>
      ) : (
        /* Input Standar */
        <input
          type={type}
          id={name}
          name={name}
          value={type === "file" ? undefined : value}
          onChange={onChange}
          placeholder={placeholder}
          accept={accept}
          required={required}
          className={`
            w-full px-5 py-3 rounded-2xl border-[3px] border-slate-200
            focus:border-blue-400 focus:ring-4 focus:ring-blue-100
            outline-none transition-all text-slate-700 bg-white font-medium
            
            ${
              type === "file"
                ? "file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200 cursor-pointer p-2"
                : ""
            }
          `}
          {...props}
        />
      )}
    </div>
  );
};

/**
 * 2. Komponen Select
 */
export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Pilih opsi",
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full mb-5 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="font-bold text-slate-700 ml-2 tracking-wide"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Select */}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full px-5 py-3 rounded-2xl border-[3px] border-slate-200
          focus:border-blue-400 focus:ring-4 focus:ring-blue-100
          outline-none transition-all text-slate-700 bg-white font-medium
        "
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * 3. Komponen Wrapper Form Utama
 */
const Form = ({
  onSubmit,
  title,
  children,
  submitText = "Simpan",
  submitVariant = "primary",
  isLoading = false,
  className = "",
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white p-8 rounded-[2.5rem] shadow-[0_10px_20px_rgba(0,0,0,0.1)] border-4 border-slate-50 w-full max-w-lg mx-auto ${className}`}
    >
      {/* Judul Form */}
      {title && (
        <h2 className="text-2xl font-black text-center text-slate-800 mb-6 drop-shadow-sm uppercase tracking-wider">
          {title}
        </h2>
      )}

      {/* Area Input */}
      <div className="mb-8">{children}</div>

      {/* Tombol Submit */}
      <div className="flex justify-center mt-4">
        <Button
          type="submit"
          variant={submitVariant}
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Menyimpan..." : submitText}
        </Button>
      </div>
    </form>
  );
};

export default Form;