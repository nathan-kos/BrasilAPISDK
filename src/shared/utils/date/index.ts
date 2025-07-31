class DateUtils {
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Retorna 'YYYY-MM-DD'
  }

  static parseDate(dateString: string): Date | null {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return null;
    const date = new Date(dateString + 'T00:00:00');
    return this.isValidDate(date) ? date : null;
  }

  static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  static isAfterDate(dateString: string, comparisonDate: Date): boolean {
    const date = this.parseDate(dateString);
    if (!date) return false;
    return date.getTime() > comparisonDate.getTime();
  }
}
export { DateUtils };
