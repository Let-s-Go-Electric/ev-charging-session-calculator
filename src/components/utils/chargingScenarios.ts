// Generate a realistic charging scenario description based on session parameters
export function generateChargingScenario(
  chargingSpeed: number,
  timeSpent: number,
  startingSoC: number
): string {
  const hours = Math.floor(timeSpent);
  const minutes = Math.round((timeSpent - hours) * 60);

  // Emergency/Very Low Battery scenarios (under 10%)
  if (startingSoC < 10) {
    if (chargingSpeed >= 150) {
      return "Emergency charge! You pushed your range a bit too far on a road trip and made a quick stop at a highway fast charger to get enough juice to reach your destination. 😅";
    } else if (chargingSpeed >= 50) {
      return "Running on fumes! You found a nearby charging station just in time and are getting enough charge to make it home or to your next stop. 🔋";
    } else {
      return "Battery was critically low, but you're charging up at whatever station you could find. Time to grab a meal and relax while the battery recovers. 🍔";
    }
  }

  // Quick DCFC stops (< 30 minutes)
  if (timeSpent < 0.5 && chargingSpeed >= 150) {
    if (startingSoC < 30) {
      return "Quick pit stop on a road trip! You're topping up at a highway fast charger while grabbing coffee and using the restroom. ☕";
    } else {
      return "Strategic top-up during a grocery run or errand. Fast charging makes this quick and convenient! 🛒";
    }
  }

  // Medium DCFC stops (30 min - 1 hour)
  if (timeSpent >= 0.5 && timeSpent <= 1.5 && chargingSpeed >= 100) {
    return "Perfect charging break during a road trip. Time for a sit-down meal at a nearby restaurant while the car charges to 80%. 🍽️";
  }

  // Level 2 charging - Coffee shop / Shopping (2-4 hours)
  if (timeSpent >= 1.5 && timeSpent <= 4 && chargingSpeed >= 15 && chargingSpeed < 50) {
    if (timeSpent <= 2.5) {
      return "Enjoying a leisurely coffee shop visit or catching a movie while your EV charges. The perfect excuse to take a break! ☕🎬";
    } else {
      return "Shopping day! Your car is charging at the mall or shopping center while you browse stores with friends and family. 🛍️";
    }
  }

  // Level 2 charging - Work / Long stays (4-8 hours)
  if (timeSpent >= 4 && timeSpent <= 8 && chargingSpeed >= 10 && chargingSpeed < 50) {
    return "Charging at work or during a long visit with family/friends. Your EV will be fully charged and ready when you're done for the day. 💼👨‍👩‍👧‍👦";
  }

  // Overnight Level 1/2 charging (6+ hours)
  if (timeSpent >= 6 && chargingSpeed < 25) {
    if (startingSoC < 20) {
      return "Home from a long road trip! Plugging in overnight to fully recover the battery for the week ahead. Sweet dreams! 😴🌙";
    } else {
      return "Typical overnight home charging. You'll wake up to a full battery, ready for whatever the day brings. Perfect for daily commuting! 🏠🌅";
    }
  }

  // Overnight Level 2 charging at higher speeds
  if (timeSpent >= 6 && chargingSpeed >= 25 && chargingSpeed < 50) {
    return "Overnight charging at home with Level 2. Your EV will be topped off and ready for a full day of driving or that weekend road trip! 🚗💨";
  }

  // Very short sessions (< 30 min, low speed)
  if (timeSpent < 0.5 && chargingSpeed < 50) {
    return "Quick opportunistic charge while running a short errand. Every little bit helps add some extra range! 🎯";
  }

  // Long slow charging (8+ hours)
  if (timeSpent >= 8) {
    return "Extended charging session, likely overnight or during a full workday. Your battery will be completely refreshed and ready for maximum range! 🔋✨";
  }

  // Default scenarios based on speed ranges
  if (chargingSpeed >= 150) {
    return "Fast charging session. Perfect for a quick break during longer trips or when you need to add range in a hurry. ⚡";
  } else if (chargingSpeed >= 50) {
    return "Moderate-speed charging while taking care of errands, shopping, or grabbing a bite to eat. 🍕";
  } else if (chargingSpeed >= 10) {
    return "Level 2 charging during a longer activity. Great for destination charging at hotels, restaurants, or entertainment venues. 🏨";
  } else {
    return "Trickle charging with Level 1. Slow but steady - perfect for when you have plenty of time and just need to maintain or slowly build up your charge. 🐌";
  }
}

// Format hours as "Xh Ym" format
export function formatTimeHoursMinutes(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  if (h === 0) {
    return `${m}m`;
  } else if (m === 0) {
    return `${h}h`;
  } else {
    return `${h}h ${m}m`;
  }
}