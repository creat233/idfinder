import { MCard, MCardStatus, MCardProduct, MCardReview } from '@/types/mcard';

const STORAGE_KEYS = {
  MCARDS: 'offline_mcards',
  STATUSES: 'offline_statuses',
  PRODUCTS: 'offline_products',
  REVIEWS: 'offline_reviews',
  REPORTED_CARDS: 'offline_reported_cards',
  USER_CARDS: 'offline_user_cards',
  PENDING_CHANGES: 'offline_pending_changes',
  LAST_SYNC: 'offline_last_sync',
};

export interface PendingChange {
  id: string;
  type: 'mcard' | 'status' | 'product' | 'review' | 'reported_card' | 'user_card';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

class OfflineStorage {
  // MCards
  saveMCard(mcard: MCard) {
    const mcards = this.getAllMCards();
    const index = mcards.findIndex(m => m.id === mcard.id);
    if (index >= 0) {
      mcards[index] = mcard;
    } else {
      mcards.push(mcard);
    }
    localStorage.setItem(STORAGE_KEYS.MCARDS, JSON.stringify(mcards));
  }

  getMCard(id: string): MCard | null {
    const mcards = this.getAllMCards();
    return mcards.find(m => m.id === id) || null;
  }

  getMCardBySlug(slug: string): MCard | null {
    const mcards = this.getAllMCards();
    return mcards.find(m => m.slug === slug) || null;
  }

  getAllMCards(): MCard[] {
    const data = localStorage.getItem(STORAGE_KEYS.MCARDS);
    return data ? JSON.parse(data) : [];
  }

  // Statuses
  saveStatuses(mcardId: string, statuses: MCardStatus[]) {
    const allStatuses = this.getAllStatuses();
    allStatuses[mcardId] = statuses;
    localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(allStatuses));
  }

  getStatuses(mcardId: string): MCardStatus[] {
    const allStatuses = this.getAllStatuses();
    return allStatuses[mcardId] || [];
  }

  private getAllStatuses(): Record<string, MCardStatus[]> {
    const data = localStorage.getItem(STORAGE_KEYS.STATUSES);
    return data ? JSON.parse(data) : {};
  }

  // Products
  saveProducts(mcardId: string, products: MCardProduct[]) {
    const allProducts = this.getAllProducts();
    allProducts[mcardId] = products;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(allProducts));
  }

  getProducts(mcardId: string): MCardProduct[] {
    const allProducts = this.getAllProducts();
    return allProducts[mcardId] || [];
  }

  private getAllProducts(): Record<string, MCardProduct[]> {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : {};
  }

  // Reviews
  saveReviews(mcardId: string, reviews: MCardReview[]) {
    const allReviews = this.getAllReviews();
    allReviews[mcardId] = reviews;
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allReviews));
  }

  getReviews(mcardId: string): MCardReview[] {
    const allReviews = this.getAllReviews();
    return allReviews[mcardId] || [];
  }

  private getAllReviews(): Record<string, MCardReview[]> {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return data ? JSON.parse(data) : {};
  }

  // Pending changes
  addPendingChange(change: Omit<PendingChange, 'id' | 'timestamp'>) {
    const changes = this.getPendingChanges();
    const newChange: PendingChange = {
      ...change,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
    };
    changes.push(newChange);
    localStorage.setItem(STORAGE_KEYS.PENDING_CHANGES, JSON.stringify(changes));
    return newChange;
  }

  getPendingChanges(): PendingChange[] {
    const data = localStorage.getItem(STORAGE_KEYS.PENDING_CHANGES);
    return data ? JSON.parse(data) : [];
  }

  removePendingChange(changeId: string) {
    const changes = this.getPendingChanges();
    const filtered = changes.filter(c => c.id !== changeId);
    localStorage.setItem(STORAGE_KEYS.PENDING_CHANGES, JSON.stringify(filtered));
  }

  clearPendingChanges() {
    localStorage.setItem(STORAGE_KEYS.PENDING_CHANGES, JSON.stringify([]));
  }

  // Last sync
  setLastSync(timestamp: number) {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString());
  }

  getLastSync(): number {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return data ? parseInt(data) : 0;
  }

  // Reported Cards
  saveReportedCard(reportedCard: any) {
    const cards = this.getAllReportedCards();
    const index = cards.findIndex(c => c.id === reportedCard.id);
    if (index >= 0) {
      cards[index] = reportedCard;
    } else {
      cards.push(reportedCard);
    }
    localStorage.setItem(STORAGE_KEYS.REPORTED_CARDS, JSON.stringify(cards));
  }

  getReportedCard(id: string): any | null {
    const cards = this.getAllReportedCards();
    return cards.find(c => c.id === id) || null;
  }

  getAllReportedCards(): any[] {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTED_CARDS);
    return data ? JSON.parse(data) : [];
  }

  // User Cards
  saveUserCard(userCard: any) {
    const cards = this.getAllUserCards();
    const index = cards.findIndex(c => c.id === userCard.id);
    if (index >= 0) {
      cards[index] = userCard;
    } else {
      cards.push(userCard);
    }
    localStorage.setItem(STORAGE_KEYS.USER_CARDS, JSON.stringify(cards));
  }

  getUserCard(id: string): any | null {
    const cards = this.getAllUserCards();
    return cards.find(c => c.id === id) || null;
  }

  getAllUserCards(): any[] {
    const data = localStorage.getItem(STORAGE_KEYS.USER_CARDS);
    return data ? JSON.parse(data) : [];
  }

  deleteUserCard(id: string) {
    const cards = this.getAllUserCards();
    const filtered = cards.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.USER_CARDS, JSON.stringify(filtered));
  }

  // Clear all offline data
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const offlineStorage = new OfflineStorage();
