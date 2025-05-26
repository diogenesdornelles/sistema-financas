import { dateSchemaMin, dateSchemaMaj } from '../validators/utils/dateSchema';

describe('Date Schema Tests', () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatDate(today);

  describe('dateSchemaMin', () => {
    it('should pass validation for dates before today', () => {
      expect(dateSchemaMin.safeParse('2020-01-02').success).toBe(true);
    });

    it("should pass validation for today's date", () => {
      expect(dateSchemaMin.safeParse(todayStr).success).toBe(true);
    });

    it('should fail validation for dates after today', () => {
      expect(dateSchemaMin.safeParse('2028-01-02').success).toBe(false);
    });

    it('should fail validation for invalid date format', () => {
      expect(dateSchemaMin.safeParse('invalid-date').success).toBe(false);
    });
  });

  describe('dateSchemaMaj', () => {
    it('should pass validation for dates after today', () => {
      expect(dateSchemaMaj.safeParse('2090-01-01').success).toBe(true);
    });

    it("should fail validation for today's date", () => {
      expect(dateSchemaMaj.safeParse(todayStr).success).toBe(false);
    });

    it('should fail validation for dates before today', () => {
      expect(dateSchemaMaj.safeParse('2020-01-01').success).toBe(false);
    });

    it('should fail validation for invalid date format', () => {
      expect(dateSchemaMaj.safeParse('not a date').success).toBe(false);
    });
  });
});
