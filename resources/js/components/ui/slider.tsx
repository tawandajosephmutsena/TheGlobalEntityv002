import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A custom premium slider component that doesn't require @radix-ui/react-slider
 * using a standard input range with custom styling.
 */
export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onValueChange?: (value: number[]) => void;
    defaultValue?: number[];
    value?: number[];
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, onValueChange, defaultValue, value, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onValueChange) {
                onValueChange([parseFloat(e.target.value)]);
            }
        };

        const displayValue = value ? value[0] : (defaultValue ? defaultValue[0] : props.min || 0);

        return (
            <div className={cn("relative flex w-full touch-none select-none items-center py-2", className)}>
                <input
                    type="range"
                    ref={ref}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    value={displayValue}
                    onChange={handleChange}
                    {...props}
                />
            </div>
        );
    }
);

Slider.displayName = "Slider";

export { Slider };
