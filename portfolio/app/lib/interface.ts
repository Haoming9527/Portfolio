export interface ProjectsCard {
  title: string;
  _id: string;
  link: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

export interface Certificate {
  title: string;
  _id: string;
  description: string;
  tags: string[];
  imageUrl: string;
  company?: string;
  orderRank?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface Education {
  title: string;
  _id: string;
  period: string;
  description: string;
  color: string;
  url?: string;
  logo: {
    asset: {
      url: string;
    };
  };
  logoUrl: string;
}

export interface Experience {
  title: string;
  _id: string;
  organization: string;
  period: string;
  description: string;
  url?: string;
  logo: {
    asset: {
      url: string;
    };
  };
  logoUrl: string;
}

export interface Technology {
  name: string;
  _id: string;
  icon: {
    asset: {
      url: string;
    };
  };
  iconUrl: string;
  link?: string;
}
