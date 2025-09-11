export interface Memory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  date: string;
  people: string[];
  tags: string[];
}

export const dummyMemories: Memory[] = [
  {
    id: '1',
    title: '사랑하는 가족들과 함께한 시간',
    description: '손자들과 함께한 즐거운 가족 모임이었습니다.',
    imageUrl: 'https://i.imgur.com/k2m3s4f.png',
    location: {
      name: '대구 월성동',
      lat: 35.8714,
      lng: 128.6014
    },
    date: '2024.05.05',
    people: ['손자', '딸', '사위'],
    tags: ['가족', '모임', '행복']
  },
  {
    id: '2',
    title: '아름다운 봄날의 산책',
    description: '벚꽃이 만개한 대구 수성못에서의 산책.',
    imageUrl: 'https://i.imgur.com/example1.jpg',
    location: {
      name: '수성못',
      lat: 35.8250,
      lng: 128.6300
    },
    date: '2024.04.15',
    people: ['친구'],
    tags: ['산책', '봄', '자연']
  },
  {
    id: '3',
    title: '생신 잔치',
    description: '70세 생신을 맞아 가족들이 모두 모여 축하해준 특별한 날.',
    imageUrl: 'https://i.imgur.com/example2.jpg',
    location: {
      name: '대구 중구',
      lat: 35.8700,
      lng: 128.5900
    },
    date: '2024.03.20',
    people: ['가족', '친척', '친구들'],
    tags: ['생신', '축하', '특별한날']
  },
  {
    id: '4',
    title: '옛날 친구들과의 만남',
    description: '오랜만에 만난 동창생들과의 즐거운 모임.',
    imageUrl: 'https://i.imgur.com/example3.jpg',
    location: {
      name: '대구 동구',
      lat: 35.8800,
      lng: 128.6400
    },
    date: '2024.02.10',
    people: ['동창생들'],
    tags: ['친구', '추억', '만남']
  },
  {
    id: '5',
    title: '손자와의 첫 등산',
    description: '손자와 함께한 첫 등산. 힘들었지만 함께한 시간이 소중했습니다.',
    imageUrl: 'https://i.imgur.com/example4.jpg',
    location: {
      name: '팔공산',
      lat: 35.9000,
      lng: 128.7000
    },
    date: '2024.01.25',
    people: ['손자'],
    tags: ['등산', '손자', '자연']
  }
];
