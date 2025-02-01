export type ContentData = {
  StandardCollection: {
    containers: Container[];
  };
};

export type Container = {
  set: Set;
};

export type Set = {
  setId: string;
  refId?: string;
  type: "ShelfContainer" | "SetRef" | "CuratedSet";
  items: Item[];
  text: {
    title: {
      full: {
        set: {
          default: {
            content: string;
          };
        };
      };
    };
  };
};

export type VideoArt = {
  mediaMetadata: {
    urls: { url: string }[];
  };
};
export type Item = {
  contentId?: string;
  collectionId?: string;
  videoArt?: VideoArt[];
  text: {
    title: {
      full: {
        series?: {
          default: {
            content: string;
          };
        };
        program?: {
          default: {
            content: string;
          };
        };
        default?: {
          default: {
            content: string;
          };
        };
      };
    };
  };
  image: {
    tile: {
      "1.78": {
        series?: {
          default: {
            url: string;
          };
        };
        program?: {
          default: {
            url: string;
          };
        };
        default?: {
          default: {
            url: string;
          };
        };
      };
    };
  };
};
