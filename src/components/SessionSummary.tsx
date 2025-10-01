import { Battery, BatteryCharging, Zap, DollarSign, Gauge, TrendingUp, Sparkles, Clock, AlertCircle } from "lucide-react";
import { generateChargingScenario, formatTimeHoursMinutes } from "./utils/chargingScenarios";
import { DistanceUnit, getDistanceUnitLabel } from "./utils/unitConversions";

interface SessionSummaryProps {
  // Battery state
  startingSoC: number;
  startingKwh: number;
  startingRange: number; // Already converted to current unit
  endingSoC: number;
  endingKwh: number;
  expectedRange: number; // Already converted to current unit
  
  // Charging details
  efficiency: number;
  totalEnergy: number;
  rangeAdded: number; // Already converted to current unit
  totalCost: number;
  chargingSpeed: number;
  timeSpent: number;
  chargingTime: number;
  idleTime: number;
  chargingCost: number;
  idleFee: number;
  distanceUnit: DistanceUnit;
}

export function SessionSummary({
  startingSoC,
  startingKwh,
  startingRange,
  endingSoC,
  endingKwh,
  expectedRange,
  efficiency,
  totalEnergy,
  rangeAdded,
  totalCost,
  chargingSpeed,
  timeSpent,
  chargingTime,
  idleTime,
  chargingCost,
  idleFee,
  distanceUnit,
}: SessionSummaryProps) {
  const scenarioText = generateChargingScenario(chargingSpeed, timeSpent, startingSoC);
  const formattedTime = formatTimeHoursMinutes(timeSpent);
  const formattedChargingTime = formatTimeHoursMinutes(chargingTime);
  const formattedIdleTime = formatTimeHoursMinutes(idleTime);
  const hasIdleTime = idleTime > 0;
  const unitLabel = getDistanceUnitLabel(distanceUnit);
  return (
    <div className="pt-4 sm:pt-5 md:pt-6 border-t border-border space-y-4">
      <h3 className="text-foreground/80">Session Summary</h3>

      {/* Visual Progress Flow */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-foreground/60" />
            <span className="text-foreground/70">Starting</span>
          </div>
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-green-600" />
            <span className="text-foreground/70">Ending</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-12 bg-muted rounded-full overflow-hidden border border-border">
          {/* Starting level - existing charge */}
          <div
            className="absolute inset-y-0 left-0 bg-blue-400 dark:bg-blue-500 transition-all"
            style={{ width: `${startingSoC}%` }}
          />
          {/* Added charge - green portion */}
          <div
            className="absolute inset-y-0 bg-green-500 transition-all"
            style={{ 
              left: `${startingSoC}%`,
              width: `${Math.max(0, endingSoC - startingSoC)}%` 
            }}
          />
          
          {/* Percentage labels with better contrast */}
          <div className="absolute inset-0 flex items-center justify-between px-4 text-sm">
            <span className="bg-black/60 text-white px-3 py-1 rounded">
              {startingSoC.toFixed(0)}%
            </span>
            <span className="bg-black/60 text-white px-3 py-1 rounded">
              {endingSoC.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="flex items-center justify-center mt-2">
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <span>{startingSoC.toFixed(0)}%</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-green-600">{endingSoC.toFixed(0)}%</span>
            <span className="text-foreground/40">({(endingSoC - startingSoC).toFixed(0)}% added)</span>
          </div>
        </div>
      </div>

      {/* AI Scenario Card */}
      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-foreground/80">What's happening during this session?</h4>
            <p className="text-sm text-foreground/70 leading-relaxed">{scenarioText}</p>
          </div>
        </div>
      </div>

      {/* Battery State Card */}
      <div className="bg-muted/20 rounded-lg p-4 border border-border/50 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Battery className="w-4 h-4 text-foreground/60" />
          <h4 className="text-foreground/80">Battery State</h4>
        </div>
        
        <div className="grid gap-2">
          {/* Starting State */}
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <span className="text-foreground/60">Starting:</span>
            <span className="text-foreground text-right">{startingSoC.toFixed(0)}%</span>
            
            <span className="text-foreground/60 text-sm pl-4">Energy:</span>
            <span className="text-foreground/70 text-sm text-right">{startingKwh.toFixed(1)} kWh</span>
            
            <span className="text-foreground/60 text-sm pl-4">Range:</span>
            <span className="text-foreground/70 text-sm text-right">{startingRange.toFixed(0)} {unitLabel}</span>
          </div>

          <div className="border-t border-border/30 my-1"></div>

          {/* Ending State */}
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <span className="text-foreground/60">Ending:</span>
            <span className="text-foreground text-right">{endingSoC.toFixed(0)}%</span>
            
            <span className="text-foreground/60 text-sm pl-4">Energy:</span>
            <span className="text-foreground/70 text-sm text-right">{endingKwh.toFixed(1)} kWh</span>
            
            <span className="text-foreground/60 text-sm pl-4">Range:</span>
            <span className="text-foreground/70 text-sm text-right">{expectedRange.toFixed(0)} {unitLabel}</span>
          </div>
        </div>
      </div>

      {/* Charging Details Card */}
      <div className="bg-muted/20 rounded-lg p-4 border border-border/50 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-foreground/60" />
          <h4 className="text-foreground/80">Charging Details</h4>
        </div>
        
        <div className="grid gap-2">
          <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-foreground/40" />
              <span className="text-foreground/60">Time Spent:</span>
            </div>
            <span className="text-foreground">{formattedTime}</span>
          </div>

          {hasIdleTime && (
            <>
              <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                <div className="flex items-center gap-2 pl-4">
                  <BatteryCharging className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-foreground/60 text-sm">Charging:</span>
                </div>
                <span className="text-foreground/70 text-sm">{formattedChargingTime}</span>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                <div className="flex items-center gap-2 pl-4">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-foreground/60 text-sm">Idle:</span>
                </div>
                <span className="text-orange-600 text-sm">{formattedIdleTime}</span>
              </div>
            </>
          )}

          <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-foreground/40" />
              <span className="text-foreground/60">Efficiency:</span>
            </div>
            <span className="text-foreground">{(efficiency * 100).toFixed(0)}%</span>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-foreground/40" />
              <span className="text-foreground/60">Energy Delivered:</span>
            </div>
            <span className="text-foreground">{totalEnergy.toFixed(2)} kWh</span>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-foreground/40" />
              <span className="text-foreground/60">Range Added:</span>
            </div>
            <span className="text-foreground">{rangeAdded.toFixed(0)} {unitLabel}</span>
          </div>

          <div className="border-t border-border/30 my-1"></div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-foreground/40" />
              <span className="text-foreground/60">Charging Cost:</span>
            </div>
            <span className="text-foreground">${chargingCost.toFixed(2)}</span>
          </div>

          {hasIdleTime && (
            <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-foreground/60">Idle Fee:</span>
              </div>
              <span className="text-orange-600">${idleFee.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t border-border/30 my-1"></div>

          <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-foreground/40" />
              <span className="text-foreground/60">Total Cost:</span>
            </div>
            <span className="text-foreground">${totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}