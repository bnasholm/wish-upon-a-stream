const HOME_PAGE_DATA_API =
  "https://cd-static.bamgrid.com/dp-117731241344/home.json";

const DYNAMIC_SET_DATA_API =
  "https://cd-static.bamgrid.com/dp-117731241344/sets";

export const fetchRefData = async (refId: string) => {
  try {
    const response = await fetch(`${DYNAMIC_SET_DATA_API}/${refId}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchHomePageData = async () => {
  try {
    const response = await fetch(HOME_PAGE_DATA_API);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
