import { useState } from "react";
import { SliderControl } from "./components/SliderControl";
import { ChargingSpeedControl, getChargingEfficiency } from "./components/ChargingSpeedControl";
import { VehicleSettingsDialog, DEFAULT_VEHICLE, VehicleSettings } from "./components/VehicleSettingsDialog";
import { StartingSoCControl } from "./components/StartingSoCControl";
import { Button } from "./components/ui/button";
import { Car } from "lucide-react";

export default function App() {
  const [startingSoC, setStartingSoC] = useState(20); // percentage (0-100)
  const [chargingSpeed, setChargingSpeed] = useState(50);
  const [timeSpent, setTimeSpent] = useState(2);
  const [pricePerKwh, setPricePerKwh] = useState(0.25);

  // Range states
  const [chargingSpeedRange, setChargingSpeedRange] = useState({ min: 0, max: 500 });
  const [timeRange, setTimeRange] = useState({ min: 0, max: 24 });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1 });

  // Vehicle settings
  const [vehicleSettings, setVehicleSettings] = useState<VehicleSettings>(DEFAULT_VEHICLE);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);

  // Calculate efficiency based on charging speed
  const efficiency = getChargingEfficiency(chargingSpeed);
  
  // Total Energy = Time * Charging Speed * Efficiency
  const totalEnergy = timeSpent * chargingSpeed * efficiency;
  
  // Total Cost = Total Energy * Price per kWh
  const totalCost = totalEnergy * pricePerKwh;

  // Vehicle-based calculations
  const startingKwh = (startingSoC / 100) * vehicleSettings.batteryCapacity;
  const endingKwh = Math.min(startingKwh + totalEnergy, vehicleSettings.batteryCapacity);
  const endingSoC = (endingKwh / vehicleSettings.batteryCapacity) * 100;
  const startingMiles = (startingSoC / 100) * vehicleSettings.rangeAtFull;
  const milesAdded = (totalEnergy / vehicleSettings.batteryCapacity) * vehicleSettings.rangeAtFull;
  const expectedRange = (endingSoC / 100) * vehicleSettings.rangeAtFull;

  // Handler for charging speed range change
  const handleChargingSpeedRangeChange = (min: number, max: number) => {
    setChargingSpeedRange({ min, max });
    // Clamp current value to new range
    if (chargingSpeed < min) setChargingSpeed(min);
    if (chargingSpeed > max) setChargingSpeed(max);
  };

  // Handler for time range change
  const handleTimeRangeChange = (min: number, max: number) => {
    setTimeRange({ min, max });
    // Clamp current value to new range
    if (timeSpent < min) setTimeSpent(min);
    if (timeSpent > max) setTimeSpent(max);
  };

  // Handler for price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    // Clamp current value to new range
    if (pricePerKwh < min) setPricePerKwh(min);
    if (pricePerKwh > max) setPricePerKwh(max);
  };

  return (
    <div className="size-full overflow-y-auto bg-background p-3 sm:p-4 md:p-6">
      <div className="min-h-full flex items-center justify-center py-4">
        <div className="w-full max-w-2xl space-y-4 sm:space-y-5 md:space-y-6 border border-primary/30 rounded-lg p-4 sm:p-5 md:p-6 bg-card">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-foreground/90">EV Charging Session Simulator</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVehicleDialogOpen(true)}
            className="gap-2 shrink-0"
          >
            <Car className="w-4 h-4" />
            <span className="hidden xs:inline">Adjust Vehicle</span>
            <span className="xs:hidden">Vehicle</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg border border-border/50">
          <Car className="w-4 h-4 text-foreground/60" />
          <span className="text-foreground/70">{vehicleSettings.name}</span>
        </div>

        <StartingSoCControl
          value={startingSoC}
          onChange={setStartingSoC}
          vehicleSettings={vehicleSettings}
        />
        
        <ChargingSpeedControl
          value={chargingSpeed}
          onChange={setChargingSpeed}
          min={chargingSpeedRange.min}
          max={chargingSpeedRange.max}
          onRangeChange={handleChargingSpeedRangeChange}
        />

        <SliderControl
          label="Time Spent"
          value={timeSpent}
          onChange={setTimeSpent}
          min={timeRange.min}
          max={timeRange.max}
          step={0.25}
          minLabel={`${timeRange.min} hours`}
          maxLabel={`${timeRange.max} hours`}
          formatValue={(value) => `${value.toFixed(2)} hours`}
          onRangeChange={handleTimeRangeChange}
        />

        <SliderControl
          label="Price/kWh"
          value={pricePerKwh}
          onChange={setPricePerKwh}
          min={priceRange.min}
          max={priceRange.max}
          step={0.01}
          minLabel={`${priceRange.min.toFixed(2)}`}
          maxLabel={`${priceRange.max.toFixed(2)}`}
          formatValue={(value) => `${value.toFixed(2)}`}
          onRangeChange={handlePriceRangeChange}
        />

        {/* Summary Section */}
        <div className="pt-4 sm:pt-5 md:pt-6 border-t border-border space-y-3">
          <h3 className="text-foreground/80">Session Summary</h3>
          
          <div className="space-y-1 text-foreground/70">
            <h4 className="text-foreground/80">Battery State</h4>
            <p className="break-words">Starting: {startingSoC.toFixed(0)}% ({startingKwh.toFixed(1)} kWh, {startingMiles.toFixed(0)} mi)</p>
            <p className="break-words">Ending: {endingSoC.toFixed(0)}% ({endingKwh.toFixed(1)} kWh, {expectedRange.toFixed(0)} mi)</p>
          </div>

          <div className="space-y-1 text-foreground/70">
            <h4 className="text-foreground/80">Charging Details</h4>
            <p>Charging Efficiency: {(efficiency * 100).toFixed(0)}%</p>
            <p>Energy Delivered: {totalEnergy.toFixed(2)} kWh</p>
            <p>Miles Added: {milesAdded.toFixed(0)} mi</p>
            <p>Total Cost: ${totalCost.toFixed(2)}</p>
          </div>
        </div>

        {/* Vehicle Settings Dialog */}
        <VehicleSettingsDialog
          open={isVehicleDialogOpen}
          onOpenChange={setIsVehicleDialogOpen}
          settings={vehicleSettings}
          onSave={setVehicleSettings}
        />
        </div>
      </div>
    </div>
  );
}