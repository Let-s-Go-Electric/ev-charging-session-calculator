import { useState } from "react";
import { Slider } from "./ui/slider";
import { Pencil, X, Check, Settings } from "lucide-react";

interface ChargingSpeedControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  onRangeChange?: (min: number, max: number) => void;
}

type ChargingLevel = "L1" | "L2" | "DCFC1" | "DCFC2" | "DCFC3" | "DCFC4";

const CHARGING_LEVELS = {
  L1: { min: 0, max: 1.9, typical: 1, label: "L1", range: "0-1.9 kW", efficiency: 0.75 },
  L2: { min: 2, max: 19.2, typical: 11, label: "L2", range: "2-19.2 kW", efficiency: 0.9 },
  DCFC1: { min: 20, max: 75, typical: 50, label: "⚡", range: "20-75 kW", efficiency: 0.97 },
  DCFC2: { min: 75, max: 150, typical: 110, label: "⚡⚡", range: "75-150 kW", efficiency: 0.97 },
  DCFC3: { min: 150, max: 250, typical: 200, label: "⚡⚡⚡", range: "150-250 kW", efficiency: 0.97 },
  DCFC4: { min: 250, max: 500, typical: 350, label: "⚡⚡⚡⚡", range: "250-500 kW", efficiency: 0.97 },
};

// Helper function to get efficiency based on charging speed
export function getChargingEfficiency(speed: number): number {
  if (speed < 2) return CHARGING_LEVELS.L1.efficiency;
  if (speed < 20) return CHARGING_LEVELS.L2.efficiency;
  return CHARGING_LEVELS.DCFC1.efficiency; // All DCFC levels have same efficiency
}

export function ChargingSpeedControl({ 
  value, 
  onChange, 
  min = 0, 
  max = 500,
  onRangeChange 
}: ChargingSpeedControlProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isEditingRange, setIsEditingRange] = useState(false);
  const [editMin, setEditMin] = useState("");
  const [editMax, setEditMax] = useState("");

  // Determine which charging level is active based on current value
  const getActiveLevel = (speed: number): ChargingLevel => {
    if (speed <= 1.9) return "L1";
    if (speed <= 19.2) return "L2";
    if (speed <= 75) return "DCFC1";
    if (speed <= 150) return "DCFC2";
    if (speed <= 250) return "DCFC3";
    return "DCFC4";
  };

  const activeLevel = getActiveLevel(value);

  // Filter charging levels based on current max value
  const visibleLevels = (Object.keys(CHARGING_LEVELS) as ChargingLevel[]).filter(
    (level) => CHARGING_LEVELS[level].min < max
  );

  const handleLevelChange = (level: ChargingLevel) => {
    // Set to typical value for that charging level
    const typicalValue = CHARGING_LEVELS[level].typical;
    // Clamp to current max if needed
    onChange(Math.min(typicalValue, max));
  };

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
        <h3 className="text-foreground/80">Charging Speed</h3>
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
            step={0.1}
          />
          <span className="text-foreground/60">Max:</span>
          <input
            type="number"
            value={editMax}
            onChange={(e) => setEditMax(e.target.value)}
            onKeyDown={handleRangeKeyDown}
            className="w-20 px-2 py-1 text-center border border-border rounded bg-input-background"
            step={0.1}
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

      {/* Button group for charging levels */}
      <div className="flex w-full border border-border rounded-lg overflow-hidden text-xs">
        {visibleLevels.map((level, index) => (
          <button
            key={level}
            onClick={() => handleLevelChange(level)}
            className={`flex-1 px-1 sm:px-2 py-2 transition-colors ${
              index < visibleLevels.length - 1 ? "border-r border-border" : ""
            } ${
              activeLevel === level
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-muted"
            }`}
          >
            <div className="text-xs sm:text-sm">{CHARGING_LEVELS[level].label}</div>
            <div className={`text-[10px] sm:text-xs ${activeLevel === level ? "text-primary-foreground/60" : "text-foreground/60"}`}>
              {CHARGING_LEVELS[level].range}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {/* Min/Max labels */}
        <div className="flex justify-between text-foreground/60 px-1">
          <span>{min} kW</span>
          <span>{max} kW</span>
        </div>

        {/* Slider */}
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={min}
          max={max}
          step={0.1}
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
                step={0.1}
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
              <span className="text-foreground">{value.toFixed(1)} kW</span>
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