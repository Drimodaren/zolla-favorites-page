import $ from 'jquery';
import type { FavoritesData } from '../types';
import { ErrorHandler } from '../utils/dom-utils';

export class FavoritesService {
  private static readonly DEFAULT_DATA_URL = 'mock/favorites.json';

  static async fetchFavorites(customUrl?: string): Promise<FavoritesData> {
    const url = customUrl || this.getDataUrl();

    try {
      const data = await $.getJSON<FavoritesData>(url);
      return data;
    } catch (error) {
      ErrorHandler.logError('Failed to fetch favorites data', error as Error);
      throw new Error('Unable to load favorites data');
    }
  }

  private static getDataUrl(): string {
    const body = document.querySelector('body');
    return body?.getAttribute('data-favorites-src') || this.DEFAULT_DATA_URL;
  }

  static validateFavoritesData(data: unknown): data is FavoritesData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const typedData = data as Partial<FavoritesData>;
    return Array.isArray(typedData.items);
  }
}
