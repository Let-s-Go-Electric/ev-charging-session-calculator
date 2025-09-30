import { useState } from "react";
import { Slider } from "./ui/slider";
import { Pencil, X, Check, Settings } from "lucide-react";

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  formatValue?: (value: number) => string;
  annotations?: { position: number; label: string }[];
  onRangeChange?: (min: number, max: number) => void;
}

export function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  formatValue,
  annotations,
  onRangeChange,
}: SliderControlProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isEditingRange, setIsEditingRange] = useState(false);
  const [editMin, setEditMin] = useState("");
  const [editMax, setEditMax] = useState("");

  const displayValue = formatValue ? formatValue(value) : value.toString();

  const handleEditClick = () => {
    setEditValue(value.toString());
    setIsEditing(true);
  };

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleRangeEditClick = () => {
    setEditMin(min.toString());
    setEditMax(max.toString());
    setIsEditingRange(true);
  };

  const handleRangeSave = () => {
    const numMin = parseFloat(editMin);
    const numMax = parseFloat(editMax);
    if (!isNaN(numMin) && !isNaN(numMax) && numMin < numMax && onRangeChange) {
      onRangeChange(numMin, numMax);
      setIsEditingRange(false);
    }
  };

  const handleRangeCancel = () => {
    setIsEditingRange(false);
    setEditMin("");
    setEditMax("");
  };

  const handleRangeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRangeSave();
    } else if (e.key === "Escape") {
      handleRangeCancel();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground/80">{label}</h3>
        {onRangeChange && (
          <button
            onClick={handleRangeEditClick}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Adjust range"
          >
            <Settings className="w-4 h-4 text-foreground/60" />
          </button>
        )}
      </div>
      
      {isEditingRange && onRangeChange && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
          <span className="text-foreground/60">Min:</span>
          <input
            type="number"
            value={editMin}
            onChange={(e) => setEditMin(e.target.value)}
            onKeyDown={handleRangeKeyDown}
            className="w-20 px-2 py-1 text-center border border-border rounded bg-input-background"
            step={step}
          />
          <span className="text-foreground/60">Max:</span>
          <input
            type="number"
            value={editMax}
            onChange={(e) => setEditMax(e.target.value)}
            onKeyDown={handleRangeKeyDown}
            className="w-20 px-2 py-1 text-center border border-border rounded bg-input-background"
            step={step}
          />
          <button
            onClick={handleRangeSave}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Save range"
          >
            <Check className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={handleRangeCancel}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}
      
      <div className="space-y-2">
        {/* Annotations (like L1, L2, DCFC) */}
        {annotations && (
          <div className="relative h-6">
            {annotations.map((annotation, index) => {
              const percentage = ((annotation.position - min) / (max - min)) * 100;
              return (
                <div
                  key={index}
                  className="absolute text-foreground/60"
                  style={{
                    left: `${percentage}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {annotation.label}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Min/Max labels */}
        <div className="flex justify-between text-foreground/60 px-1">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>

        {/* Slider */}
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />

        {/* Current value display with edit functionality */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {isEditing ? (
            <>
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-24 px-2 py-1 text-center border border-border rounded bg-input-background"
                min={min}
                max={max}
                step={step}
                autoFocus
              />
              <button
                onClick={handleSave}
                className="p-1 hover:bg-muted rounded transition-colors"
                title="Save"
              >
                <Check className="w-4 h-4 text-green-600" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-muted rounded transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </>
          ) : (
            <>
              <span className="text-foreground">{displayValue}</span>
              <button
                onClick={handleEditClick}
                className="p-1 hover:bg-muted rounded transition-colors"
                title="Edit value"
              >
                <Pencil className="w-3 h-3 text-foreground/60" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}