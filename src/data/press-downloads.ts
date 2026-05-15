export type PressDownload = {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  filename: string;
};

export const PRESS_DOWNLOADS: PressDownload[] = [
  {
    id: 'logo',
    label: 'Logo (PNG)',
    sublabel: '1024×1024 square brand mark',
    href: '/press/mindorfact-logo.png',
    filename: 'mindorfact-logo.png',
  },
  {
    id: 'screenshots',
    label: 'Screenshots (ZIP)',
    sublabel: 'iPhone 17 Pro Max screenshots, Ukrainian UI',
    href: '/press/mindorfact-screenshots.zip',
    filename: 'mindorfact-screenshots.zip',
  },
];
