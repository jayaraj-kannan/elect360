export interface Booth {
  id: string;
  name: string;
  address: string;
  distance?: string;
  travelTime?: string;
  coords: { lat: number; lng: number };
}

export interface Ward {
  id: string;
  name: string;
  stateId: string;
  districtId?: string;
  constituencyId?: string;
  constituencyName?: string;
  booth: Booth;
}

export interface Constituency {
  id: string;
  name: string;
  wards: Ward[];
}

export interface District {
  id: string;
  name: string;
  constituencies: Constituency[];
}

export interface State {
  id: string;
  name: string;
  districts: District[];
}

export const electionData: State[] = [
  {
    id: "TN",
    name: "Tamil Nadu",
    districts: [
      {
        id: "chennai",
        name: "Chennai",
        constituencies: [
          {
            id: "mylapore",
            name: "Mylapore",
            wards: [
              {
                id: "123",
                stateId: "tn",
                districtId: "chennai",
                constituencyId: "mylapore",
                name: "Ward 123 - Santhome",
                booth: {
                  id: "b1",
                  name: "Govt Higher Secondary School",
                  address: "34, West Mada Street, Mylapore, Chennai, 600004",
                  distance: "0.8 KM",
                  travelTime: "4 MINS",
                  coords: { lat: 13.033, lng: 80.267 }
                }
              },
              {
                id: "124",
                stateId: "tn",
                districtId: "chennai",
                constituencyId: "mylapore",
                name: "Ward 124 - Luz",
                booth: {
                  id: "b2",
                  name: "Lady Sivaswami Ayyar Girls School",
                  address: "Sundareswarar Street, Mylapore, Chennai, 600004",
                  distance: "0.5 KM",
                  travelTime: "2 MINS",
                  coords: { lat: 13.035, lng: 80.264 }
                }
              }
            ]
          },
          {
            id: "t-nagar",
            name: "T. Nagar",
            wards: [
              {
                id: "141",
                stateId: "tn",
                districtId: "chennai",
                constituencyId: "t-nagar",
                name: "Ward 141 - Pondy Bazaar",
                booth: {
                  id: "b3",
                  name: "Ramakrishna Mission School",
                  address: "71, Bazullah Road, T. Nagar, Chennai, 600017",
                  distance: "1.2 KM",
                  travelTime: "8 MINS",
                  coords: { lat: 13.045, lng: 80.233 }
                }
              }
            ]
          }
        ]
      },
      {
        id: "madurai",
        name: "Madurai",
        constituencies: [
          {
            id: "madurai-central",
            name: "Madurai Central",
            wards: [
              {
                id: "1",
                stateId: "tn",
                districtId: "madurai",
                constituencyId: "madurai-central",
                name: "Ward 1 - Meenakshi Temple",
                booth: {
                  id: "b4",
                  name: "St. Marys Higher Secondary School",
                  address: "East Veli Street, Madurai, 625001",
                  distance: "0.3 KM",
                  travelTime: "5 MINS (Walk)",
                  coords: { lat: 9.925, lng: 78.12 }
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "KA",
    name: "Karnataka",
    districts: [
      {
        id: "bangalore",
        name: "Bangalore Urban",
        constituencies: [
          {
            id: "shanti-nagar",
            name: "Shanti Nagar",
            wards: [
              {
                id: "111",
                stateId: "KA",
                districtId: "bangalore",
                constituencyId: "shanti-nagar",
                name: "Ward 111 - Shantala Nagar",
                booth: {
                  id: "b5",
                  name: "Baldwin Boys High School",
                  address: "Hosur Road, Richmond Town, Bangalore, 560025",
                  distance: "1.0 KM",
                  travelTime: "6 MINS",
                  coords: { lat: 12.966, lng: 77.598 }
                }
              }
            ]
          },
          {
            id: "indira-nagar",
            name: "Indiranagar",
            wards: [
              {
                id: "80",
                stateId: "KA",
                districtId: "bangalore",
                constituencyId: "indira-nagar",
                name: "Ward 80 - Hoysala Nagar",
                booth: {
                  id: "b6",
                  name: "Indiranagar Library",
                  address: "100 Feet Road, Indiranagar, Bangalore, 560038",
                  distance: "0.4 KM",
                  travelTime: "3 MINS",
                  coords: { lat: 12.971, lng: 77.641 }
                }
              }
            ]
          }
        ]
      },
      {
        id: "mysore",
        name: "Mysore",
        constituencies: [
          {
            id: "kr-mohalla",
            name: "KR Mohalla",
            wards: [
              {
                id: "10",
                stateId: "KA",
                districtId: "mysore",
                constituencyId: "kr-mohalla",
                name: "Ward 10 - Palace Grounds",
                booth: {
                  id: "b7",
                  name: "Maharaja College Ground",
                  address: "JLB Road, Mysore, 570005",
                  distance: "0.5 KM",
                  travelTime: "4 MINS",
                  coords: { lat: 12.305, lng: 76.641 }
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
