/* eslint-disable */
// @ts-nocheck

const initialPatients = [
    { id: 1, name: 'Emily Carter', time: '10:00 AM', status: 'active', age: 38, pastDiseases: 'Allergic Rhinitis', weight: '68 kg', bp: '118/75', sugarLevel: '92 mg/dL' },
    { id: 2, name: 'Michael Bui', time: '10:30 AM', status: 'waiting', age: 55, pastDiseases: 'Type 2 Diabetes', weight: '95 kg', bp: '135/88', sugarLevel: '140 mg/dL' },
    { id: 3, name: 'Sarah Chen', time: '11:00 AM', status: 'waiting', age: 29, pastDiseases: 'None', weight: '58 kg', bp: '110/70', sugarLevel: '85 mg/dL' },
    { id: 4, name: 'Robert Davis', time: '11:30 AM', status: 'waiting', age: 67, pastDiseases: 'Coronary Artery Disease', weight: '82 kg', bp: '145/92', sugarLevel: '105 mg/dL' },
    { id: 5, name: 'Jessica Miller', time: '12:00 PM', status: 'waiting', age: 42, pastDiseases: 'Migraines', weight: '75 kg', bp: '125/80', sugarLevel: '98 mg/dL' },
];

export const getInitialPatients = () => initialPatients;
