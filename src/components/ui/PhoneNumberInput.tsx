import {
  forwardRef,
  type ChangeEventHandler,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/lib/utils";
import { toNationalPhoneInput } from "@/lib/phone";

type PhoneNumberInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "inputMode"
> & {
  hasError?: boolean;
  containerClassName?: string;
};

export const PhoneNumberInput = forwardRef<
  HTMLInputElement,
  PhoneNumberInputProps
>(function PhoneNumberInput(
  {
    hasError = false,
    containerClassName,
    className,
    onChange,
    ...props
  },
  ref,
) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.target.value = toNationalPhoneInput(event.target.value);
    onChange?.(event);
  };

  return (
    <div
      className={cn(
        "flex h-12 overflow-hidden rounded-lg border bg-white transition-colors",
        "focus-within:ring-2 focus-within:ring-offset-1",
        hasError
          ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20"
          : "border-gray-300 focus-within:border-blue-600 focus-within:ring-blue-600/20",
        containerClassName,
      )}
    >
      <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-700">
        +62
      </span>

      <input
        {...props}
        ref={ref}
        type="tel"
        inputMode="numeric"
        aria-invalid={hasError || undefined}
        onChange={handleChange}
        className={cn(
          "min-w-0 flex-1 bg-white px-4 outline-none",
          "placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      />
    </div>
  );
});