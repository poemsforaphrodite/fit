export const exerciseOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '8ff286b609msh624cda40cb7ff8bp162180jsne1545ee9b080',
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
  },
};

export const youtubeOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '8ff286b609msh624cda40cb7ff8bp162180jsne1545ee9b080',
    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
  },
};

export const fetchData = async (url, options) => {
  const res = await fetch(url, options);
  const data = await res.json();

  return data;
};
