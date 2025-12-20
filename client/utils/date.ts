/**
 * Format datetime: 17/12/2025 10:07
 */
export function formatDateTime(
    value?: string | Date,
    locale = "vi-VN"
  ): string {
    if (!value) return "";
  
    const date = new Date(value);
  
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
  
  /**
   * Format date: 17/12/2025
   */
  export function formatDate(
    value?: string | Date,
    locale = "vi-VN"
  ): string {
    if (!value) return "";
  
    return new Date(value).toLocaleDateString(locale);
  }
  
  /**
   * Format time: 10:07
   */
  export function formatTime(
    value?: string | Date,
    locale = "vi-VN"
  ): string {
    if (!value) return "";
  
    return new Date(value).toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  /**
   * Format relative time: "10 phút trước"
   */
  export function formatRelativeTime(
    value?: string | Date,
    locale = "vi-VN"
  ): string {
    if (!value) return "";
  
    const now = new Date();
    const date = new Date(value);
  
    const diff = date.getTime() - now.getTime(); // ms
    const seconds = Math.round(diff / 1000);
    const minutes = Math.round(diff / 60);
    const hours = Math.round(diff / 3600);
    const days = Math.round(diff / 86400);
  
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  
    if (Math.abs(seconds) < 60) return rtf.format(seconds, "second");
    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    return rtf.format(days, "day");
  }
  