interface ISiteMetadataResult {
  siteTitle: string;
  siteUrl: string;
  description: string;
  logo: string;
  navLinks: {
    name: string;
    url: string;
  }[];
}

const getBasePath = () => {
  const baseUrl = import.meta.env.BASE_URL;
  return baseUrl === '/' ? '' : baseUrl;
};

const data: ISiteMetadataResult = {
  siteTitle: 'Max Running',
  siteUrl: 'https://maxrunning.vercel.app',
  logo: 'https://i.postimg.cc/2Sg9QXxb/2730369-blue-character-inkcontober-run-sonic-icon.png',
  description: 'Personal site and blog',
  navLinks: [
    {
      name: 'Summary',
      url: `${getBasePath()}/summary`,
    },
    {
      name: 'Origin',
      url: 'https://github.com/yihong0618/gitblog',
    },
  ],
};

export default data;
