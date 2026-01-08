// Use process.env directly to avoid config dependency
const getPublicUrl = () => {
  return process.env.NEXT_PUBLIC_URL || ''
}

export const baseOpenGraph = {
  locale: 'en_US',
  alternateLocale: ['vi_VN'],
  type: 'website',
  siteName: 'Bigboy Restaurant',
  images: [
    {
      url: `${getPublicUrl()}/banner.png`
    }
  ]
}
