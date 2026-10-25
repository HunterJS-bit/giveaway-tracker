interface CountdownEntry {
  endDate: string;
  timeLeft: string;
}

export const useCountdown = () => {
  const countdowns = useState<Map<string, CountdownEntry>>('countdowns', () => new Map());
  let timer: any = null;

  const getTimeLeft = (endDate: string): string => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) {
      return 'Završeno';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const registerCountdown = (id: string, endDate: string) => {
    countdowns.value.set(id, {
      endDate,
      timeLeft: getTimeLeft(endDate),
    });

    // Start shared timer if not already running (client-side only)
    if (!timer && process.client) {
      timer = setInterval(() => {
        countdowns.value.forEach((entry, key) => {
          entry.timeLeft = getTimeLeft(entry.endDate);
        });
      }, 60000); // Update every minute
    }
  };

  const unregisterCountdown = (id: string) => {
    countdowns.value.delete(id);
    
    // Stop timer if no more countdowns
    if (countdowns.value.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const getCountdown = (id: string) => {
    return countdowns.value.get(id)?.timeLeft || '';
  };

  return {
    registerCountdown,
    unregisterCountdown,
    getCountdown,
  };
};
