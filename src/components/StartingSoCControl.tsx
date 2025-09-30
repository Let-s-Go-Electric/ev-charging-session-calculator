import { useState } from "react";
import { Slider } from "./ui/slider";
import { Pencil, X, Check } from "lucide-react";
import { VehicleSettings } from "./VehicleSettingsDialog";

interface StartingSoCControlProps {
  value: number; // Always stored as percentage (0-100)
  onChange: (value: number) => void;
  vehicleSettings: VehicleSettings;
}

type SoCUnit = "percentage" | "miles" | "kwh";

export function StartingSoCControl({
  value,
  onChange,
  vehicleSettings,
}: StartingSoCControlProps) {
  const [unit, setUnit] = useState<SoCUnit>("percentage");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  // Convert percentage to other units
  const getValueInUnit = (percentage: number, targetUnit: SoCUnit): number => {
    switch (targetUnit) {
      case "percentage":
        return percentage;
      case "kwh":
        return (percentage / 100) * vehicleSettings.batteryCapacity;
      case "miles":
        return (percentage / 100) * vehicleSettings.rangeAtFull;
    }
  };

  // Convert from any unit to percentage
  const convertToPercentage = (val: number, fromUnit: SoCUnit): number => {
    switch (fromUnit) {
      case "percentage":
        return val;
      case "kwh":
        return (val / vehicleSettings.batteryCapacity) * 100;
      case "miles":
        return (val / vehicleSettings.rangeAtFull) * 100;
    }
  };

  const displayValue = getValueInUnit(value, unit);

  // Get min/max for current unit
  const getRange = (currentUnit: SoCUnit) => {
    switch (currentUnit) {
      case "percentage":
        return { min: 0, max: 100, step: 1 };
      case "kwh":
        return { min: 0, max: vehicleSettings.batteryCapacity, step: 0.1 };
      case "miles":
        return { min: 0, max: vehicleSettings.rangeAtFull, step: 1 };
    }
  };

  const range = getRange(unit);

  // Format value for display
  const formatValue = (val: number, currentUnit: SoCUnit): string => {
    switch (currentUnit) {
      case "percentage":
        return `${val.toFixed(0)}%`;
      case "kwh":
        return `${val.toFixed(1)} kWh`;
      case "miles":
        return `${val.toFixed(0)} mi`;
    }
  };

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    const percentage = convertToPercentage(newValue, unit);
    onChange(Math.max(0, Math.min(100, percentage)));
  };

  const handleEditClick = () => {
    setEditValue(displayValue.toFixed(unit === "kwh" ? 1 : 0));
    setIsEditing(true);
  };

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue) && numValue >= range.min && numValue <= range.max) {
      const percentage = convertToPercentage(numValue, unit);
      onChange(Math.max(0, Math.min(100, percentage)));
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

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground/80">Starting State of Charge</h3>
      </div>

      {/* Unit toggle buttons */}
      <div className="flex w-full border border-border rounded-lg overflow-hidden text-sm">
        <button
          onClick={() => setUnit("percentage")}
          className={`flex-1 px-2 sm:px-3 py-2 transition-colors border-r border-border ${
            unit === "percentage"
              ? "bg-primary text-primary-foreground"
              : "bg-card hover:bg-muted"
          }`}
        >
          <span className="hidden sm:inline">Percentage</span>
          <span className="sm:hidden">%</span>
        </button>
        <button
          onClick={() => setUnit("miles")}
          className={`flex-1 px-2 sm:px-3 py-2 transition-colors border-r border-border ${
            unit === "miles"
              ? "bg-primary text-primary-foreground"
              : "bg-card hover:bg-muted"
          }`}
        >
          Miles
        </button>
        <button
          onClick={() => setUnit("kwh")}
          className={`flex-1 px-2 sm:px-3 py-2 transition-colors ${
            unit === "kwh"
              ? "bg-primary text-primary-foreground"
              : "bg-card hover:bg-muted"
          }`}
        >
          kWh
        </button>
      </div>

      <div className="space-y-2">
        {/* Min/Max labels */}
        <div className="flex justify-between text-foreground/60 px-1">
          <span>{formatValue(range.min, unit)}</span>
          <span>{formatValue(range.max, unit)}</span>
        </div>

        {/* Slider */}
        <Slider
          value={[displayValue]}
          onValueChange={handleSliderChange}
          min={range.min}
          max={range.max}
          step={range.step}
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
                min={range.min}
                max={range.max}
                step={range.step}
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
              <span className="text-foreground">
                {formatValue(displayValue, unit)}
              </span>
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