export const NEPAL_DATA = {
  "Koshi": ["Biratnagar", "Dharan", "Itahari", "Damak", "Other"],
  "Madhesh": ["Birgunj", "Janakpur", "Rajbiraj", "Other"],
  "Bagmati": ["Kathmandu", "Lalitpur", "Bhaktapur", "Bharatpur", "Hetauda", "Other"],
  "Gandaki": ["Pokhara", "Other"],
  "Lumbini": ["Butwal", "Nepalgunj", "Tulsipur", "Ghorahi", "Other"],
  "Karnali": ["Birendranagar", "Other"],
  "Sudurpashchim": ["Dhangadhi", "Tikapur", "Other"]
};

export const ALL_CITIES = Object.values(NEPAL_DATA).flat().filter((v, i, a) => a.indexOf(v) === i && v !== "Other").sort();

export const CITY_TO_PROVINCE = Object.entries(NEPAL_DATA).reduce((acc, [province, cities]) => {
  cities.forEach(city => {
    if (city !== "Other") {
      acc[city] = province;
    }
  });
  return acc;
}, {});
