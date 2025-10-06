import type { Product, ProductSize, ValidationResult } from '../types';

export class SizeValidator {
  static validateSizeSelection(product: Product, selectedSize: string | null): ValidationResult {
    if (!selectedSize) {
      return {
        isValid: false,
        message: 'Пожалуйста, выберите размер',
      };
    }

    const sizeInfo = this.findSizeInfo(product, selectedSize);

    if (!sizeInfo) {
      return {
        isValid: false,
        message: `Размер ${selectedSize} не найден`,
      };
    }

    if (!sizeInfo.available) {
      return {
        isValid: false,
        message: `Размер ${selectedSize} недоступен`,
      };
    }

    return {
      isValid: true,
    };
  }

  static findSizeInfo(product: Product, size: string): ProductSize | undefined {
    return product.sizes.find(sizeInfo => sizeInfo.value === size);
  }

  static getAvailableSizes(product: Product): ProductSize[] {
    return product.sizes.filter(size => size.available);
  }

  static hasAvailableSizes(product: Product): boolean {
    return this.getAvailableSizes(product).length > 0;
  }

  static formatSizeOption(size: ProductSize): string {
    const availabilityLabel = size.available ? '' : ' — нет в наличии';
    return `${size.value}${availabilityLabel}`;
  }
}
