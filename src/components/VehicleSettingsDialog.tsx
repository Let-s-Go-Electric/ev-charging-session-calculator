import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export interface VehicleSettings {
  name: string;
  batteryCapacity: number; // kWh
  rangeAtFull: number; // miles
  maxChargingSpeed: number; // kW
  time10to80: number; // minutes at >250kW
}

interface VehicleSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: VehicleSettings;
  onSave: (settings: VehicleSettings) => void;
}

export const DEFAULT_VEHICLE: VehicleSettings = {
  name: "2025 Hyundai IONIQ 5 SEL RWD",
  batteryCapacity: 84,
  rangeAtFull: 320,
  maxChargingSpeed: 350,
  time10to80: 20,
};

export function VehicleSettingsDialog({
  open,
  onOpenChange,
  settings,
  onSave,
}: VehicleSettingsDialogProps) {
  const [editedSettings, setEditedSettings] = useState<VehicleSettings>(settings);

  useEffect(() => {
    setEditedSettings(settings);
  }, [settings, open]);

  const handleSave = () => {
    onSave(editedSettings);
    onOpenChange(false);
  };

  const handleReset = () => {
    setEditedSettings(DEFAULT_VEHICLE);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vehicle Settings</DialogTitle>
          <DialogDescription>
            Adjust the default vehicle parameters for your charging simulation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleName">Vehicle Name</Label>
            <Input
              id="vehicleName"
              value={editedSettings.name}
              onChange={(e) =>
                setEditedSettings({ ...editedSettings, name: e.target.value })
              }
              placeholder="Enter vehicle name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batteryCapacity">Usable Battery Capacity (kWh)</Label>
            <Input
              id="batteryCapacity"
              type="number"
              value={editedSettings.batteryCapacity}
              onChange={(e) =>
                setEditedSettings({
                  ...editedSettings,
                  batteryCapacity: parseFloat(e.target.value) || 0,
                })
              }
              step={0.1}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rangeAtFull">Range at 100% (miles)</Label>
            <Input
              id="rangeAtFull"
              type="number"
              value={editedSettings.rangeAtFull}
              onChange={(e) =>
                setEditedSettings({
                  ...editedSettings,
                  rangeAtFull: parseFloat(e.target.value) || 0,
                })
              }
              step={1}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxChargingSpeed">Max Charging Speed (kW)</Label>
            <Input
              id="maxChargingSpeed"
              type="number"
              value={editedSettings.maxChargingSpeed}
              onChange={(e) =>
                setEditedSettings({
                  ...editedSettings,
                  maxChargingSpeed: parseFloat(e.target.value) || 0,
                })
              }
              step={1}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time10to80">
              10-80% Charge Time (minutes at {">"}250kW)
            </Label>
            <Input
              id="time10to80"
              type="number"
              value={editedSettings.time10to80}
              onChange={(e) =>
                setEditedSettings({
                  ...editedSettings,
                  time10to80: parseFloat(e.target.value) || 0,
                })
              }
              step={0.5}
              min={0}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
          <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
            Reset to Default
          </Button>
          <div className="flex gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-initial">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 sm:flex-initial">Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}