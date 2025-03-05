import * as React from "react";
import { CheckCircle } from "lucide-react";
import * as RadioGroupPrimitive from "@headlessui/react";

import { cn } from "../../lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.RadioGroup>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.RadioGroup>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.RadioGroup
      ref={ref}
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.RadioGroup.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.RadioGroup.Option>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.RadioGroup.Option>
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.RadioGroup.Option
      ref={ref}
      className={({ active, checked }) =>
        cn(
          "relative flex cursor-pointer rounded-md px-3 py-2 focus:outline-none",
          active && "ring-2 ring-ring ring-offset-2",
          checked
            ? "bg-primary/10 text-primary"
            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          className
        )
      }
      {...props}
    >
      {({ checked }) => (
        <>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              {children}
            </div>
            {checked ? (
              <CheckCircle className="h-5 w-5 text-primary" />
            ) : null}
          </div>
        </>
      )}
    </RadioGroupPrimitive.RadioGroup.Option>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };