import { Supporter } from '../types';

export const INITIAL_SUPPORTERS: Supporter[] = [
  {
    id: 'supp-1',
    nickname: 'ShadowKing_Uz',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    isVip: true,
    amount: 100000,
    dateSupported: '2026-02-01',
    visible: true,
    displayOrder: 1
  },
  {
    id: 'supp-2',
    nickname: 'Anilibria_Fan',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    isVip: true,
    amount: 50000,
    dateSupported: '2026-02-03',
    visible: true,
    displayOrder: 2
  },
  {
    id: 'supp-3',
    nickname: 'NarutoUzbek',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    isVip: false,
    amount: 25000,
    dateSupported: '2026-02-04',
    visible: true,
    displayOrder: 3
  },
  {
    id: 'supp-4',
    nickname: 'OtakuMaster',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isVip: true,
    amount: 75000,
    dateSupported: '2026-02-05',
    visible: true,
    displayOrder: 4
  }
];
