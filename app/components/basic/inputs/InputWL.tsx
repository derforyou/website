import type { ChangeEvent } from "react";

export default function Input({
  name,
  placeholder,
  type,
  alert,
  className,
  inputClassName,
  rows,
  title,
  defaultValue,
  onChange,
}: {
  title: string;
  name: string;
  placeholder?: string;
  type?: "text" | "email" | "number" | "password" | "textarea";
  alert?: string | undefined | boolean;
  bgColor?: string;
  className?: string;
  inputClassName?: string;
  rows?: number;
  defaultValue?: string | number;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  if (type === "textarea") {
    return (
      <div className={`mt-2 w-full ${className}`}>
        <div className="pb-3">
          <strong className="text-2xl">{title}</strong>
        </div>
        <div className="relative">
          {typeof alert === "string" && (
            <div className="top-0 left-5 absolute px-2 -translate-y-1/2">
              <div className="relative px-2">
                <div className="top-0 left-0 absolute bg-item-1 w-full h-1/2" />
                <div className="bottom-0 left-0 absolute bg-bg w-full h-1/2" />
                <p className="relative text-alert-1 text-sm">{alert}</p>
              </div>
            </div>
          )}

          <textarea
            name={name}
            rows={rows || 4}
            placeholder={placeholder}
            className={`w-full commonInput resize-none ${inputClassName} ${
              alert ? "ring-[2px] ring-alert-1" : ""
            }`}
            defaultValue={defaultValue}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative mt-2 w-full ${className}`}>
      <div className="pb-3">
        <strong className="text-2xl">{title}</strong>
      </div>
      <div className="relative">
        {typeof alert === "string" && (
          <div className="top-0 left-5 absolute px-2 -translate-y-1/2">
            <div className="relative px-2">
              <div className="top-0 left-0 absolute bg-item-1 w-full h-1/2" />
              <div className="bottom-0 left-0 absolute bg-bg w-full h-1/2" />
              <p className="relative text-alert-1 text-sm">{alert}</p>
            </div>
          </div>
        )}

        <input
          type={type || "text"}
          name={name}
          placeholder={placeholder}
          className={`w-full commonInput ${inputClassName} ${
            alert ? "ring-[2px] ring-alert-1" : ""
          }`}
          defaultValue={defaultValue}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
