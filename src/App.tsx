import { useState } from "react";
import { SliderControl } from "./components/SliderControl";
import { ChargingSpeedControl, getChargingEfficiency } from "./components/ChargingSpeedControl";
import { VehicleSettingsDialog, DEFAULT_VEHICLE, VehicleSettings } from "./components/VehicleSettingsDialog";
import { StartingSoCControl } from "./components/StartingSoCControl";
import { SessionSummary } from "./components/SessionSummary";
import { AIChatInterface } from "./components/AIChatInterface";
import { formatTimeHoursMinutes } from "./components/utils/chargingScenarios";
import { DistanceUnit, convertDistance } from "./components/utils/unitConversions";
import { Button } from "./components/ui/button";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { Car, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [startingSoC, setStartingSoC] = useState(20); // percentage (0-100)
  const [chargingSpeed, setChargingSpeed] = useState(50);
  const [timeSpent, setTimeSpent] = useState(1);
  const [pricePerKwh, setPricePerKwh] = useState(0.25);
  const [idleFeePerMinute, setIdleFeePerMinute] = useState(0.50);

  // Range states
  const [chargingSpeedRange, setChargingSpeedRange] = useState({ min: 0, max: 500 });
  const [timeRange, setTimeRange] = useState({ min: 0, max: 24 });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1 });
  const [idleFeeRange, setIdleFeeRange] = useState({ min: 0, max: 2 });

  // Vehicle settings
  const [vehicleSettings, setVehicleSettings] = useState<VehicleSettings>(DEFAULT_VEHICLE);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);

  // AI mode
  const [isAIMode, setIsAIMode] = useState(false);
  const [isManualControlsOpen, setIsManualControlsOpen] = useState(true);

  // Unit system
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>("miles");

  // Calculate efficiency based on charging speed
  const efficiency = getChargingEfficiency(chargingSpeed);
  
  // Vehicle-based calculations (always stored in miles, converted for display)
  const startingKwh = (startingSoC / 100) * vehicleSettings.batteryCapacity;
  const startingMiles = (startingSoC / 100) * vehicleSettings.rangeAtFull;
  const startingRange = convertDistance(startingMiles, distanceUnit);
  
  // Calculate maximum energy that can be delivered (can't exceed battery capacity)
  const remainingCapacity = vehicleSettings.batteryCapacity - startingKwh;
  const maxPossibleEnergy = timeSpent * chargingSpeed * efficiency;
  const actualEnergyDelivered = Math.min(maxPossibleEnergy, remainingCapacity);
  
  // Calculate time to reach 100% (if charging speed > 0)
  const timeToFull = chargingSpeed > 0 ? remainingCapacity / (chargingSpeed * efficiency) : Infinity;
  const chargingTime = Math.min(timeSpent, timeToFull);
  const idleTime = Math.max(0, timeSpent - timeToFull);
  
  // Costs
  const chargingCost = actualEnergyDelivered * pricePerKwh;
  const idleFee = idleTime * 60 * idleFeePerMinute; // Convert hours to minutes
  const totalCost = chargingCost + idleFee;
  
  // Battery state after charging
  const endingKwh = startingKwh + actualEnergyDelivered;
  const endingSoC = (endingKwh / vehicleSettings.batteryCapacity) * 100;
  const milesAdded = (actualEnergyDelivered / vehicleSettings.batteryCapacity) * vehicleSettings.rangeAtFull;
  const expectedRangeMiles = (endingSoC / 100) * vehicleSettings.rangeAtFull;
  
  // Convert distances for display
  const rangeAdded = convertDistance(milesAdded, distanceUnit);
  const expectedRange = convertDistance(expectedRangeMiles, distanceUnit);

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

  // Handler for idle fee range change
  const handleIdleFeeRangeChange = (min: number, max: number) => {
    setIdleFeeRange({ min, max });
    // Clamp current value to new range
    if (idleFeePerMinute < min) setIdleFeePerMinute(min);
    if (idleFeePerMinute > max) setIdleFeePerMinute(max);
  };

  return (
    <div className="size-full overflow-y-auto bg-background p-3 sm:p-4 md:p-6">
      <div className="min-h-full flex items-center justify-center py-4">
        <div className="w-full max-w-2xl space-y-4 sm:space-y-5 md:space-y-6 border border-primary/30 rounded-lg p-4 sm:p-5 md:p-6 bg-card">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-foreground/90">EV Charging Session Calculator</h1>
          <div className="flex items-center gap-2">
            {/* Distance Unit Toggle */}
            <ToggleGroup
              type="single"
              value={distanceUnit}
              onValueChange={(value) => value && setDistanceUnit(value as DistanceUnit)}
              className="border border-border rounded-lg"
            >
              <ToggleGroupItem value="miles" aria-label="Miles" className="text-sm px-3">
                mi
              </ToggleGroupItem>
              <ToggleGroupItem value="km" aria-label="Kilometers" className="text-sm px-3">
                km
              </ToggleGroupItem>
            </ToggleGroup>
            
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
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg border border-border/50">
          <Car className="w-4 h-4 text-foreground/60" />
          <span className="text-foreground/70">{vehicleSettings.name}</span>
        </div>

        {/* AI Mode Toggle */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <Label htmlFor="ai-mode" className="cursor-pointer">
                AI Assistant Mode
              </Label>
              <p className="text-sm text-foreground/60">Ask EV charging and road trip questions in natural language</p>
            </div>
          </div>
          <Switch
            id="ai-mode"
            checked={isAIMode}
            onCheckedChange={setIsAIMode}
          />
        </div>

        {/* AI Chat Interface - Quick ease-in animation */}
        <AnimatePresence mode="wait">
          {isAIMode && (
            <motion.div
              key="ai-interface"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: isAIMode ? 0.3 : 0.5,
                ease: isAIMode ? "easeOut" : "easeIn"
              }}
            >
              <AIChatInterface />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual Controls - Collapsible when AI mode is active, slower ease-out when toggling off */}
        <AnimatePresence mode="wait">
          {isAIMode ? (
            <motion.div
              key="collapsible-controls"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Collapsible open={isManualControlsOpen} onOpenChange={setIsManualControlsOpen}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                  >
                    <span>Manual Controls</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isManualControlsOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 sm:space-y-5 md:space-y-6 mt-4">
                  <StartingSoCControl
                    value={startingSoC}
                    onChange={setStartingSoC}
                    vehicleSettings={vehicleSettings}
                    distanceUnit={distanceUnit}
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

                  <SliderControl
                    label="Idle Fee (per minute)"
                    value={idleFeePerMinute}
                    onChange={setIdleFeePerMinute}
                    min={idleFeeRange.min}
                    max={idleFeeRange.max}
                    step={0.05}
                    minLabel={`${idleFeeRange.min.toFixed(2)}`}
                    maxLabel={`${idleFeeRange.max.toFixed(2)}`}
                    formatValue={(value) => `${value.toFixed(2)}`}
                    onRangeChange={handleIdleFeeRangeChange}
                  />
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          ) : (
            <motion.div
              key="standard-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
              className="space-y-4 sm:space-y-5 md:space-y-6"
            >
              <StartingSoCControl
                value={startingSoC}
                onChange={setStartingSoC}
                vehicleSettings={vehicleSettings}
                distanceUnit={distanceUnit}
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
                minLabel={`${timeRange.min}h`}
                maxLabel={`${timeRange.max}h`}
                formatValue={(value) => formatTimeHoursMinutes(value)}
                onRangeChange={handleTimeRangeChange}
                isTimeInput={true}
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

              <SliderControl
                label="Idle Fee (per minute)"
                value={idleFeePerMinute}
                onChange={setIdleFeePerMinute}
                min={idleFeeRange.min}
                max={idleFeeRange.max}
                step={0.05}
                minLabel={`${idleFeeRange.min.toFixed(2)}`}
                maxLabel={`${idleFeeRange.max.toFixed(2)}`}
                formatValue={(value) => `${value.toFixed(2)}`}
                onRangeChange={handleIdleFeeRangeChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Section */}
        <SessionSummary
          startingSoC={startingSoC}
          startingKwh={startingKwh}
          startingRange={startingRange}
          endingSoC={endingSoC}
          endingKwh={endingKwh}
          expectedRange={expectedRange}
          efficiency={efficiency}
          totalEnergy={actualEnergyDelivered}
          rangeAdded={rangeAdded}
          totalCost={totalCost}
          chargingSpeed={chargingSpeed}
          timeSpent={timeSpent}
          chargingTime={chargingTime}
          idleTime={idleTime}
          chargingCost={chargingCost}
          idleFee={idleFee}
          distanceUnit={distanceUnit}
        />

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